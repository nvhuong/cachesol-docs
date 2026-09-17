package com.cachesol.platform.iam.controller;

import com.cachesol.platform.iam.service.KeycloakProvisioningService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * SERVICE-API — Keycloak group management (tenant-manager gọi khi tạo org tree).
 *
 *   POST /service-api/v1/groups        → Tạo group (Keycloak Group ≈ Org tree node)
 *   PUT  /service-api/v1/groups/{id}/members/{userId}  → add user to group
 */
@RestController
@RequestMapping("/service-api/v1/groups")
@RequiredArgsConstructor
public class KeycloakGroupController {

    private final KeycloakProvisioningService service;

    @PostMapping
    public ApiResponse<Map<String, Object>> create(
            @RequestHeader("X-Realm") String realm,
            @RequestBody Map<String, String> body) {
        String name = body.get("name");
        String path = body.get("path");
        if (name == null || name.isBlank()) {
            throw new com.cachesol.platform.shared.common.exception.PlatformException(
                    "VALIDATION", "name is required");
        }
        String id = service.createGroup(realm, name, path);
        return ApiResponse.ok(Map.of(
                "id", id != null ? id : "",
                "name", name,
                "path", path != null ? path : ("/" + name)
        ));
    }

    @PutMapping("/{groupId}/members/{userId}")
    public ApiResponse<Void> addMember(
            @RequestHeader("X-Realm") String realm,
            @PathVariable String groupId,
            @PathVariable String userId) {
        service.addUserToGroup(realm, userId, groupId);
        return ApiResponse.ok(null);
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ApiResponse<Void> removeMember(
            @RequestHeader("X-Realm") String realm,
            @PathVariable String groupId,
            @PathVariable String userId) {
        service.removeUserFromGroup(realm, userId, groupId);
        return ApiResponse.ok(null);
    }
}
