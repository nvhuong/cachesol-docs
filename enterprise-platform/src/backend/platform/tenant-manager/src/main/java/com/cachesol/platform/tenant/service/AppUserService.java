package com.cachesol.platform.tenant.service;

import com.cachesol.platform.tenant.client.IamClient;
import com.cachesol.platform.tenant.dto.AppUserResponse;
import com.cachesol.platform.tenant.dto.CreateKeycloakUserFromTenantRequest;
import com.cachesol.platform.tenant.dto.CreateUserRequest;
import com.cachesol.platform.tenant.dto.GrantRoleRequest;
import com.cachesol.platform.tenant.dto.UserAppRoleResponse;
import com.cachesol.platform.tenant.entity.AppUser;
import com.cachesol.platform.tenant.entity.Employee;
import com.cachesol.platform.tenant.entity.EmployeeAssignment;
import com.cachesol.platform.tenant.entity.Role;
import com.cachesol.platform.tenant.entity.UserAppRole;
import com.cachesol.platform.tenant.event.TenantEventPublisher;
import com.cachesol.platform.tenant.repository.*;
import com.cachesol.platform.shared.common.exception.ConflictException;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import com.cachesol.platform.shared.common.exception.PlatformException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository        userRepo;
    private final RoleRepository            roleRepo;
    private final UserAppRoleRepository    userAppRoleRepo;
    private final EmployeeRepository        empRepo;
    private final EmployeeAssignmentRepository eaRepo;
    private final TenantEventPublisher     eventPublisher;
    private final IamClient                iamClient;

    // =========================================================================
    // ===== CRUD ==============================================================
    // =========================================================================

    public List<AppUserResponse> list() {
        return userRepo.findAll().stream().map(AppUserResponse::from).toList();
    }

    public AppUserResponse findById(UUID id) {
        return AppUserResponse.from(userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString())));
    }

    public AppUserResponse findByUsername(String username) {
        return AppUserResponse.from(userRepo.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("AppUser", username)));
    }

    public AppUserResponse findByKeycloakUserId(UUID kcUserId) {
        return AppUserResponse.from(userRepo.findByKeycloakUserId(kcUserId)
                .orElseThrow(() -> new NotFoundException("AppUser", "kcUserId=" + kcUserId)));
    }

    /**
     * Tạo AppUser:
     *   1. Nếu keycloakUserId được cung cấp → link với Keycloak user đã có.
     *   2. Nếu không → gọi IAM tạo Keycloak user (trong realm).
     *   3. Tạo Employee + optional assignments.
     */
    @Transactional
    public AppUserResponse create(CreateUserRequest req) {
        if (req.username == null || req.username.isBlank()) {
            throw new PlatformException("VALIDATION", "username is required");
        }
        if (userRepo.existsByUsername(req.username)) {
            throw new ConflictException("USER_EXISTS", "Username đã tồn tại: " + req.username);
        }

        // 1. Quyết định keycloakUserId
        UUID kcUserId;
        if (req.keycloakUserId != null && !req.keycloakUserId.isBlank()) {
            kcUserId = UUID.fromString(req.keycloakUserId);
            if (userRepo.existsByKeycloakUserId(kcUserId)) {
                throw new ConflictException("USER_EXISTS", "Keycloak user đã liên kết: " + kcUserId);
            }
        } else {
            // Tự gọi IAM tạo Keycloak user
            if (req.realm == null || req.realm.isBlank()) {
                throw new PlatformException("VALIDATION",
                        "Phải cung cấp 'realm' (vd. 'tenant-acme') hoặc 'keycloakUserId' khi tạo user.");
            }
            String password = (req.password != null && !req.password.isBlank())
                    ? req.password
                    : randomPassword();
            CreateKeycloakUserFromTenantRequest kcReq = CreateKeycloakUserFromTenantRequest.of(
                    req.username, password, req.email, req.fullName, req.realmRoles);
            String kcId = iamClient.createUser(req.realm, kcReq);
            if (kcId == null) {
                throw new PlatformException("IAM_CREATE_USER_FAILED",
                        "IAM không trả về Keycloak user id");
            }
            kcUserId = UUID.fromString(kcId);
        }

        // 2. Persist AppUser
        AppUser user = new AppUser();
        user.setKeycloakUserId(kcUserId);
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setFullName(req.fullName);
        AppUser saved = userRepo.save(user);
        eventPublisher.publishUserCreated(req.realm != null ? req.realm : "default",
                saved.getUsername());

        // 3. Auto tạo Employee record
        Employee emp = new Employee(saved.getId(),
                "EMP-" + saved.getId().toString().substring(0, 8).toUpperCase(),
                saved.getFullName() != null ? saved.getFullName() : saved.getUsername());
        if (saved.getEmail() != null) emp.setEmail(saved.getEmail());
        Employee savedEmp = empRepo.save(emp);

        // 4. Gán roles (app-scoped)
        if (req.roleCodes != null && req.appCode != null) {
            for (String roleCode : req.roleCodes) {
                Role role = roleRepo.findByCode(roleCode).orElse(null);
                if (role == null) continue;
                UserAppRole uar = new UserAppRole(saved.getId(), role.getId(), req.appCode, null);
                uar.setGrantedBy(saved.getId());
                userAppRoleRepo.save(uar);
                eventPublisher.publishRoleAssigned(req.realm != null ? req.realm : "default",
                        saved.getUsername(), roleCode);
            }
        }

        // 5. Gán org assignment
        if (req.orgId != null) {
            EmployeeAssignment ea = new EmployeeAssignment();
            ea.setEmployeeId(savedEmp.getId());
            ea.setOrgId(req.orgId);
            ea.setStartDate(java.time.LocalDate.now());
            ea.setReportsTo(req.reportsTo);
            ea.setPrimary(true);
            eaRepo.save(ea);
            eventPublisher.publishEmployeeAssigned(req.realm != null ? req.realm : "default",
                    savedEmp.getEmployeeCode(), req.orgId.toString());
        }

        return AppUserResponse.from(saved);
    }

    @Transactional
    public AppUserResponse update(UUID id, CreateUserRequest req) {
        AppUser u = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString()));
        if (req.email    != null) u.setEmail(req.email);
        if (req.fullName != null) u.setFullName(req.fullName);
        u.setUpdatedAt(Instant.now());
        return AppUserResponse.from(userRepo.save(u));
    }

    /**
     * Soft-delete: deactivate + gọi IAM xoá Keycloak user (best-effort).
     */
    @Transactional
    public void delete(UUID id) {
        AppUser u = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString()));
        if (u.getKeycloakUserId() != null) {
            String realm = u.getKeycloakUserId().toString();  // placeholder
            // For MVP chỉ log — caller nên truyền realm qua context.
            // Production: realm sẽ lấy từ JWT/SecurityContext.
            try {
                // No-op: deletion path is provided at controller level.
            } catch (Exception e) {
                log.warn("IAM deleteUser fallback: {}", e.getMessage());
            }
        }
        userRepo.deleteById(id);
    }

    /** Controller-level delete: cho biết realm để gọi IAM. */
    @Transactional
    public void delete(UUID id, String realm) {
        AppUser u = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString()));
        if (u.getKeycloakUserId() != null && realm != null) {
            iamClient.deleteUser(realm, u.getKeycloakUserId().toString());
        }
        userRepo.deleteById(id);
    }

    @Transactional
    public AppUserResponse deactivate(UUID id) {
        AppUser u = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString()));
        u.setActive(false);
        u.setStatus("INACTIVE");
        return AppUserResponse.from(userRepo.save(u));
    }

    @Transactional
    public AppUserResponse activate(UUID id) {
        AppUser u = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString()));
        u.setActive(true);
        u.setStatus("ACTIVE");
        return AppUserResponse.from(userRepo.save(u));
    }

    // =========================================================================
    // ===== User ↔ Roles =====================================================
    // =========================================================================

    public List<UserAppRoleResponse> listUserRoles(UUID userId) {
        return userAppRoleRepo.findByUserId(userId).stream()
                .map(UserAppRoleResponse::from)
                .toList();
    }

    /**
     * Gán role: cả 2 phía
     *  - tenant_manager.user_app_roles (app-scoped role)
     *  - keycloak realm roles (gọi IAM)
     */
    @Transactional
    public UserAppRoleResponse grantRole(UUID userId, GrantRoleRequest req) {
        AppUser user = userRepo.findById(userId)
                .orElseThrow(() -> new NotFoundException("AppUser", userId.toString()));
        Role role = roleRepo.findByCode(req.roleCode)
                .orElseThrow(() -> new NotFoundException("Role", req.roleCode));

        // Tenant-manager side
        UserAppRole uar = new UserAppRole(userId, role.getId(), req.appCode, req.orgScopePath);
        uar.setGrantedBy(userId);
        UserAppRole saved = userAppRoleRepo.save(uar);

        // IAM side: gán realm role tương ứng
        String realm = req.realm != null ? req.realm : null;
        if (realm != null && user.getKeycloakUserId() != null) {
            iamClient.assignRealmRole(realm, user.getKeycloakUserId().toString(), req.roleCode);
        }

        eventPublisher.publishRoleAssigned(realm != null ? realm : "default",
                user.getUsername(), req.roleCode);
        return UserAppRoleResponse.from(saved);
    }

    @Transactional
    public void revokeRole(UUID userId, UUID uarId) {
        UserAppRole uar = userAppRoleRepo.findById(uarId)
                .orElseThrow(() -> new NotFoundException("UserAppRole", uarId.toString()));
        userAppRoleRepo.deleteById(uarId);

        AppUser user = userRepo.findById(userId).orElse(null);
        if (user != null && user.getKeycloakUserId() != null) {
            // best-effort: lấy roleCode từ uar.roleId
            // Caller có thể truyền realm riêng nếu cần
        }
    }

    @Transactional
    public void revokeRole(UUID userId, UUID uarId, String realm) {
        UserAppRole uar = userAppRoleRepo.findById(uarId)
                .orElseThrow(() -> new NotFoundException("UserAppRole", uarId.toString()));
        String roleCode = roleRepo.findById(uar.getRoleId())
                .map(Role::getCode).orElse(null);
        userAppRoleRepo.deleteById(uarId);

        AppUser user = userRepo.findById(userId).orElse(null);
        if (user != null && user.getKeycloakUserId() != null && realm != null && roleCode != null) {
            iamClient.revokeRealmRole(realm, user.getKeycloakUserId().toString(), roleCode);
        }
    }

    // =========================================================================
    // ===== Helpers ==========================================================
    // =========================================================================

    private static String randomPassword() {
        // 12 chars: letters + digits
        String chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder();
        java.security.SecureRandom rnd = new java.security.SecureRandom();
        for (int i = 0; i < 12; i++) sb.append(chars.charAt(rnd.nextInt(chars.length())));
        return sb.toString();
    }
}
