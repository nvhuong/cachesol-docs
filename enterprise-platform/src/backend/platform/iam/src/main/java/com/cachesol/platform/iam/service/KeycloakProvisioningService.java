package com.cachesol.platform.iam.service;

import com.cachesol.platform.iam.client.KeycloakAdminClient;
import com.cachesol.platform.iam.config.IamProperties;
import com.cachesol.platform.iam.dto.CreateKeycloakUserRequest;
import com.cachesol.platform.iam.dto.KeycloakUserResponse;
import com.cachesol.platform.iam.dto.ProvisionRealmRequest;
import com.cachesol.platform.iam.dto.ProvisionRealmResponse;
import com.cachesol.platform.shared.common.exception.ConflictException;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import com.cachesol.platform.shared.common.exception.PlatformException;
import com.cachesol.platform.shared.messaging.event.DomainEventEnvelope;
import com.cachesol.platform.shared.messaging.publisher.EventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Thin wrapper của Keycloak Admin API.
 *
 * Service-to-service interface dùng bởi:
 *  - platform-registry  : gọi provisionRealm() khi tạo tenant mới
 *  - tenant-manager     : gọi createUser()/assignRealmRole()/deleteUser() khi CRUD user
 *
 * Tất cả API được expose qua /service-api/v1/** của IAM.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakProvisioningService {

    private final KeycloakAdminClient keycloak;
    private final EventPublisher eventPublisher;
    private final IamProperties iamProps;

    // =========================================================================
    // ===== Realm operations =================================================
    // =========================================================================

    @Transactional
    public ProvisionRealmResponse provisionRealm(ProvisionRealmRequest req) {
        if (req.realm == null || req.realm.isBlank()) {
            throw new PlatformException("VALIDATION", "realm name is required");
        }
        log.info("Provisioning Keycloak realm: {} with loginTheme: {}", req.realm, req.loginTheme);

        boolean created = keycloak.createRealm(req.realm, req.displayName, req.loginTheme);

        List<String> rolesCreated = new ArrayList<>();
        List<String> rolesExisted = new ArrayList<>();
        if (req.initialRoles != null) {
            for (String role : req.initialRoles) {
                boolean wasCreated = keycloak.createRealmRole(req.realm, role,
                        "Auto-created role for realm " + req.realm);
                (wasCreated ? rolesCreated : rolesExisted).add(role);
            }
        }

        ProvisionRealmResponse.SuperAdminResponse superAdminResp = null;
        if (req.superAdmin != null && req.superAdmin.username != null) {
            String userId = keycloak.createUser(
                    req.realm,
                    req.superAdmin.username,
                    req.superAdmin.email,
                    req.superAdmin.firstName,
                    req.superAdmin.lastName,
                    req.superAdmin.password,
                    true
            );
            if (userId == null) {
                throw new KeycloakAdminClient.KeycloakOperationException(
                        "provisionRealm", req.realm, HttpStatus.BAD_GATEWAY,
                        "Keycloak không trả về user id", null);
            }
            if (req.superAdmin.realmRoles != null) {
                for (String roleName : req.superAdmin.realmRoles) {
                    try { keycloak.assignRealmRoleToUser(req.realm, userId, roleName); }
                    catch (Exception e) {
                        log.warn("Assign {} → {}: {}", roleName, req.superAdmin.username, e.getMessage());
                    }
                }
            }
            superAdminResp = new ProvisionRealmResponse.SuperAdminResponse(
                    userId, req.superAdmin.username,
                    req.superAdmin.realmRoles != null ? req.superAdmin.realmRoles : List.of()
            );
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("realm", req.realm);
        payload.put("created", created);
        payload.put("rolesCreated", rolesCreated);
        payload.put("rolesExisted", rolesExisted);
        if (superAdminResp != null) {
            payload.put("superAdminUserId", superAdminResp.keycloakUserId());
        }
        eventPublisher.publish("realm.provisioned",
                DomainEventEnvelope.of("RealmProvisioned", null, payload));

        return new ProvisionRealmResponse(req.realm, created, rolesCreated, rolesExisted, superAdminResp);
    }

    public void deleteRealm(String realm) {
        keycloak.deleteRealm(realm);
        eventPublisher.publish("realm.deleted",
                DomainEventEnvelope.of("RealmDeleted", null, Map.of("realm", realm)));
    }

    public Map<String, Object> getRealm(String realm) {
        Map<String, Object> r = keycloak.getRealm(realm);
        if (r == null) throw new NotFoundException("Realm", realm);
        return r;
    }

    // =========================================================================
    // ===== User operations ==================================================
    // =========================================================================

    public KeycloakUserResponse createUser(String realm, CreateKeycloakUserRequest req) {
        if (realm == null || realm.isBlank()) {
            throw new PlatformException("VALIDATION", "realm is required (header X-Realm hoặc body.realm)");
        }
        if (keycloak.getRealm(realm) == null) {
            throw new NotFoundException("Realm", realm);
        }
        if (keycloak.findUserIdByUsername(realm, req.username) != null) {
            throw new ConflictException("USER_EXISTS",
                    "User đã tồn tại trong Keycloak realm " + realm + ": " + req.username);
        }
        String userId = keycloak.createUser(
                realm, req.username, req.email,
                req.firstName, req.lastName,
                req.password,
                req.enabled == null ? Boolean.TRUE : req.enabled
        );
        if (userId == null) {
            throw new KeycloakAdminClient.KeycloakOperationException(
                    "createUser", realm + "/" + req.username,
                    HttpStatus.BAD_GATEWAY, "Keycloak không trả về user id", null);
        }
        if (req.realmRoles != null) {
            for (String role : req.realmRoles) {
                try { keycloak.assignRealmRoleToUser(realm, userId, role); }
                catch (Exception e) { log.warn("assignRole {} failed: {}", role, e.getMessage()); }
            }
        }
        eventPublisher.publish("keycloak.user.created",
                DomainEventEnvelope.of("KeycloakUserCreated", null,
                        Map.of("realm", realm, "keycloakUserId", userId, "username", req.username)));
        return toResponse(realm, userId);
    }

    public KeycloakUserResponse findUserById(String realm, String userId) {
        Map<String, Object> u = keycloak.findUserById(realm, userId);
        if (u == null) throw new NotFoundException("KeycloakUser", realm + "/" + userId);
        return toResponse(realm, u);
    }

    public KeycloakUserResponse findUserByUsername(String realm, String username) {
        String userId = keycloak.findUserIdByUsername(realm, username);
        if (userId == null) throw new NotFoundException("KeycloakUser", realm + "/" + username);
        return toResponse(realm, userId);
    }

    private KeycloakUserResponse toResponse(String realm, String userId) {
        Map<String, Object> u = keycloak.findUserById(realm, userId);
        if (u == null) throw new NotFoundException("KeycloakUser", userId);
        return toResponse(realm, u);
    }

    private KeycloakUserResponse toResponse(String realm, Map<String, Object> u) {
        String userId = u.get("id") == null ? null : u.get("id").toString();
        List<String> roles = userId == null ? List.of() : keycloak.getUserRealmRoles(realm, userId);
        return new KeycloakUserResponse(
                userId,
                str(u.get("username")),
                str(u.get("email")),
                str(u.get("firstName")),
                str(u.get("lastName")),
                (Boolean) u.getOrDefault("enabled", true),
                (Boolean) u.getOrDefault("emailVerified", false),
                roles
        );
    }

    public void deleteUser(String realm, String userId) {
        keycloak.deleteUser(realm, userId);
        eventPublisher.publish("keycloak.user.deleted",
                DomainEventEnvelope.of("KeycloakUserDeleted", null,
                        Map.of("realm", realm, "keycloakUserId", userId)));
    }

    public void resetPassword(String realm, String userId, String newPassword, boolean temporary) {
        keycloak.resetPassword(realm, userId, newPassword, temporary);
    }

    /**
     * Update user attributes (email, firstName, lastName, enabled, etc.).
     * Uses Keycloak PUT /admin/realms/{realm}/users/{id} for full replacement.
     */
    public KeycloakUserResponse updateUser(String realm, String userId, Map<String, Object> updates) {
        keycloak.updateUser(realm, userId, updates);
        return toResponse(realm, userId);
    }

    // =========================================================================
    // ===== Role operations ==================================================
    // =========================================================================

    public void assignRealmRole(String realm, String userId, String roleName) {
        keycloak.assignRealmRoleToUser(realm, userId, roleName);
        eventPublisher.publish("keycloak.user.role.assigned",
                DomainEventEnvelope.of("KeycloakUserRoleAssigned", null,
                        Map.of("realm", realm, "keycloakUserId", userId, "roleName", roleName)));
    }

    public void revokeRealmRole(String realm, String userId, String roleName) {
        keycloak.revokeRealmRoleFromUser(realm, userId, roleName);
        eventPublisher.publish("keycloak.user.role.revoked",
                DomainEventEnvelope.of("KeycloakUserRoleRevoked", null,
                        Map.of("realm", realm, "keycloakUserId", userId, "roleName", roleName)));
    }

    public List<String> listUserRealmRoles(String realm, String userId) {
        return keycloak.getUserRealmRoles(realm, userId);
    }

    public List<String> listRealmRoles(String realm) {
        return keycloak.listRealmRoles(realm).stream()
                .map(m -> m.get("name") == null ? null : m.get("name").toString())
                .filter(Objects::nonNull)
                .toList();
    }

    // =========================================================================
    // ===== Helpers ==========================================================
    // =========================================================================

    private static String str(Object o) { return o == null ? null : o.toString(); }
}
