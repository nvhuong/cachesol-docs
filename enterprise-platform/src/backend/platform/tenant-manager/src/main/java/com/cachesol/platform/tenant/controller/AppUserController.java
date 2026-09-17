package com.cachesol.platform.tenant.controller;

import com.cachesol.platform.tenant.dto.*;
import com.cachesol.platform.tenant.service.AppUserService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/client-api/v1/users")
@RequiredArgsConstructor
public class AppUserController {

    private final AppUserService service;

    @GetMapping
    public ApiResponse<List<AppUserResponse>> list() {
        return ApiResponse.ok(service.list());
    }

    /**
     * Tạo user.
     * - Nếu body có keycloakUserId → link với Keycloak user có sẵn.
     * - Nếu body có realm (vd. "tenant-acme") → tự gọi IAM tạo Keycloak user.
     */
    @PostMapping
    public ResponseEntity<ApiResponse<AppUserResponse>> create(
            @Valid @RequestBody CreateUserRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(service.create(req)));
    }

    @GetMapping("/{id}")
    public ApiResponse<AppUserResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.findById(id));
    }

    @GetMapping("/by-username/{username}")
    public ApiResponse<AppUserResponse> byUsername(@PathVariable String username) {
        return ApiResponse.ok(service.findByUsername(username));
    }

    @GetMapping("/by-keycloak/{keycloakUserId}")
    public ApiResponse<AppUserResponse> byKeycloakUserId(@PathVariable UUID keycloakUserId) {
        return ApiResponse.ok(service.findByKeycloakUserId(keycloakUserId));
    }

    @PatchMapping("/{id}")
    public ApiResponse<AppUserResponse> update(
            @PathVariable UUID id,
            @RequestBody CreateUserRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    /**
     * Xoá user. Truyền ?realm=tenant-acme để tenant-manager gọi IAM xoá Keycloak user.
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @PathVariable UUID id,
            @RequestParam(value = "realm", required = false) String realm) {
        if (realm != null) service.delete(id, realm);
        else service.delete(id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/{id}/deactivate")
    public ApiResponse<AppUserResponse> deactivate(@PathVariable UUID id) {
        return ApiResponse.ok(service.deactivate(id));
    }

    @PostMapping("/{id}/activate")
    public ApiResponse<AppUserResponse> activate(@PathVariable UUID id) {
        return ApiResponse.ok(service.activate(id));
    }

    // ---- Roles ----

    @GetMapping("/{id}/roles")
    public ApiResponse<List<UserAppRoleResponse>> listRoles(@PathVariable UUID id) {
        return ApiResponse.ok(service.listUserRoles(id));
    }

    @PostMapping("/{id}/roles")
    public ApiResponse<UserAppRoleResponse> grantRole(
            @PathVariable UUID id,
            @Valid @RequestBody GrantRoleRequest req) {
        return ApiResponse.ok(service.grantRole(id, req));
    }

    @DeleteMapping("/{id}/roles/{uarId}")
    public ApiResponse<Void> revokeRole(
            @PathVariable UUID id,
            @PathVariable UUID uarId,
            @RequestParam(value = "realm", required = false) String realm) {
        if (realm != null) service.revokeRole(id, uarId, realm);
        else service.revokeRole(id, uarId);
        return ApiResponse.ok(null);
    }
}
