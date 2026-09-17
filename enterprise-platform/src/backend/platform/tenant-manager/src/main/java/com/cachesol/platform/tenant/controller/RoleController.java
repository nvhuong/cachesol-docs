package com.cachesol.platform.tenant.controller;

import com.cachesol.platform.tenant.dto.CreateRoleRequest;
import com.cachesol.platform.tenant.dto.PermissionResponse;
import com.cachesol.platform.tenant.dto.RoleResponse;
import com.cachesol.platform.tenant.service.RoleService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/client-api/v1/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService service;

    @GetMapping
    public ApiResponse<List<RoleResponse>> list() {
        return ApiResponse.ok(service.list());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoleResponse>> create(
            @Valid @RequestBody CreateRoleRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(service.create(req)));
    }

    @GetMapping("/{id}")
    public ApiResponse<RoleResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @GetMapping("/by-code/{code}")
    public ApiResponse<RoleResponse> byCode(@PathVariable String code) {
        return ApiResponse.ok(service.getByCode(code));
    }

    @PatchMapping("/{id}")
    public ApiResponse<RoleResponse> update(
            @PathVariable UUID id,
            @RequestBody CreateRoleRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/permissions")
    public ApiResponse<List<PermissionResponse>> listPermissions() {
        return ApiResponse.ok(service.listPermissions());
    }
}
