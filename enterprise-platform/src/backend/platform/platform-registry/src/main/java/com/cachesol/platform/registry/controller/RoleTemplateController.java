package com.cachesol.platform.registry.controller;

import com.cachesol.platform.registry.dto.*;
import com.cachesol.platform.registry.service.PermissionTemplateService;
import com.cachesol.platform.registry.service.RoleTemplateService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Role / Permission template management.
 * CLIENT-API: super-admin dùng.
 * SERVICE-API: tenant-manager clone snapshot.
 */
@RestController
@RequiredArgsConstructor
public class RoleTemplateController {

    private final RoleTemplateService    roleTemplateService;
    private final PermissionTemplateService permService;

    // ============== CLIENT-API ==============

    @GetMapping("/client-api/v1/permissions/templates")
    public ApiResponse<List<PermissionTemplateResponse>> listPermissions() {
        return ApiResponse.ok(permService.list());
    }

    @PostMapping("/client-api/v1/permissions/templates")
    public ResponseEntity<ApiResponse<PermissionTemplateResponse>> createPermission(
            @RequestBody CreatePermissionTemplateRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(permService.create(req.code, req.description, req.category)));
    }

    @GetMapping("/client-api/v1/permissions/templates/{id}")
    public ApiResponse<PermissionTemplateResponse> getPermission(@PathVariable UUID id) {
        return ApiResponse.ok(permService.get(id));
    }

    @GetMapping("/client-api/v1/roles/templates")
    public ApiResponse<List<RoleTemplateResponse>> listRoles() {
        return ApiResponse.ok(roleTemplateService.list());
    }

    @PostMapping("/client-api/v1/roles/templates")
    public ResponseEntity<ApiResponse<RoleTemplateResponse>> createRole(
            @Valid @RequestBody CreateRoleTemplateRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(roleTemplateService.create(req)));
    }

    @GetMapping("/client-api/v1/roles/templates/{id}")
    public ApiResponse<RoleTemplateResponse> getRole(@PathVariable UUID id) {
        return ApiResponse.ok(roleTemplateService.get(id));
    }

    @PatchMapping("/client-api/v1/roles/templates/{id}")
    public ApiResponse<RoleTemplateResponse> updateRole(
            @PathVariable UUID id,
            @RequestBody CreateRoleTemplateRequest req) {
        return ApiResponse.ok(roleTemplateService.update(id, req));
    }

    @DeleteMapping("/client-api/v1/roles/templates/{id}")
    public ApiResponse<Void> deleteRole(@PathVariable UUID id) {
        roleTemplateService.delete(id);
        return ApiResponse.ok(null);
    }

    @PostMapping("/client-api/v1/roles/templates/{id}/set-default")
    public ApiResponse<RoleTemplateResponse> setDefault(@PathVariable UUID id) {
        return ApiResponse.ok(roleTemplateService.setDefault(id));
    }

    // ============== SERVICE-API ==============

    /** tenant-manager clone snapshot từ đây khi tạo tenant. */
    @GetMapping("/service-api/v1/roles/templates")
    public ApiResponse<List<RoleTemplateResponse>> serviceListRoles() {
        return ApiResponse.ok(roleTemplateService.listForServiceApi());
    }

    @GetMapping("/service-api/v1/permissions/templates")
    public ApiResponse<List<PermissionTemplateResponse>> serviceListPermissions() {
        return ApiResponse.ok(permService.list());
    }
}
