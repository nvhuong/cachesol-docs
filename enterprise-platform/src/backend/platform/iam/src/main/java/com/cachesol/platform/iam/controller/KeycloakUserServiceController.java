package com.cachesol.platform.iam.controller;

import com.cachesol.platform.iam.dto.CreateKeycloakUserRequest;
import com.cachesol.platform.iam.dto.KeycloakUserResponse;
import com.cachesol.platform.iam.service.KeycloakProvisioningService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import com.cachesol.platform.shared.common.exception.PlatformException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * SERVICE-API — Keycloak user CRUD (tenant-manager gọi khi tạo user).
 *
 *   POST   /service-api/v1/users                  → Tạo user trong Keycloak realm
 *   GET    /service-api/v1/users/{id}             → Lấy user theo id
 *   DELETE /service-api/v1/users/{id}             → Xoá user
 *   PUT    /service-api/v1/users/{id}/password    → Reset password
 *
 * Realm được xác định từ header {@code X-Realm} hoặc từ payload field {@code realm}.
 */
@RestController
@RequestMapping("/service-api/v1/users")
@RequiredArgsConstructor
public class KeycloakUserServiceController {

    private final KeycloakProvisioningService service;

    @PostMapping
    public ResponseEntity<ApiResponse<KeycloakUserResponse>> create(
            @RequestHeader(value = "X-Realm", required = false) String realmHeader,
            @Valid @RequestBody CreateKeycloakUserRequest req) {
        String realm = pickRealm(realmHeader, req.realm);
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(service.createUser(realm, req)));
    }

    @GetMapping("/{id}")
    public ApiResponse<KeycloakUserResponse> get(
            @RequestHeader("X-Realm") String realm,
            @PathVariable String id) {
        return ApiResponse.ok(service.findUserById(realm, id));
    }

    @GetMapping("/by-username/{username}")
    public ApiResponse<KeycloakUserResponse> findByUsername(
            @RequestHeader("X-Realm") String realm,
            @PathVariable String username) {
        return ApiResponse.ok(service.findUserByUsername(realm, username));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @RequestHeader("X-Realm") String realm,
            @PathVariable String id) {
        service.deleteUser(realm, id);
        return ApiResponse.ok(null);
    }

    @PutMapping("/{id}/password")
    public ApiResponse<Void> resetPassword(
            @RequestHeader("X-Realm") String realm,
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String newPassword = body.get("password");
        if (newPassword == null || newPassword.isBlank()) {
            throw new PlatformException("VALIDATION", "password is required");
        }
        boolean temporary = Boolean.parseBoolean(body.getOrDefault("temporary", "false"));
        service.resetPassword(realm, id, newPassword, temporary);
        return ApiResponse.ok(null);
    }

    /** Gán realm role cho user. */
    @PostMapping("/{id}/roles")
    public ApiResponse<Void> assignRole(
            @RequestHeader("X-Realm") String realm,
            @PathVariable String id,
            @RequestBody Map<String, Object> body) {
        Object rolesObj = body.get("realmRoles");
        if (rolesObj instanceof List<?> roles) {
            for (Object r : roles) {
                if (r != null) service.assignRealmRole(realm, id, r.toString());
            }
        } else {
            String single = (String) body.get("realmRole");
            if (single == null || single.isBlank()) {
                throw new PlatformException("VALIDATION",
                        "Provide 'realmRole' (string) hoặc 'realmRoles' (array).");
            }
            service.assignRealmRole(realm, id, single);
        }
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{id}/roles/{roleName}")
    public ApiResponse<Void> revokeRole(
            @RequestHeader("X-Realm") String realm,
            @PathVariable String id,
            @PathVariable String roleName) {
        service.revokeRealmRole(realm, id, roleName);
        return ApiResponse.ok(null);
    }

    @GetMapping("/{id}/roles")
    public ApiResponse<List<String>> listRoles(
            @RequestHeader("X-Realm") String realm,
            @PathVariable String id) {
        return ApiResponse.ok(service.listUserRealmRoles(realm, id));
    }

    private String pickRealm(String header, String bodyRealm) {
        if (header != null && !header.isBlank()) return header;
        if (bodyRealm != null && !bodyRealm.isBlank()) return bodyRealm;
        throw new PlatformException("VALIDATION",
                "Phải cung cấp realm qua header X-Realm hoặc payload field 'realm'.");
    }
}
