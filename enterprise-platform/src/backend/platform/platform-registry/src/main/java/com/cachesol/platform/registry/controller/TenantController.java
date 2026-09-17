package com.cachesol.platform.registry.controller;

import com.cachesol.platform.registry.dto.*;
import com.cachesol.platform.registry.service.TenantMiniAppService;
import com.cachesol.platform.registry.service.TenantService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * Tenant CRUD + lifecycle (suspend, offboard) + per-tenant mini-app enable.
 */
@RestController
@RequiredArgsConstructor
public class TenantController {

    private final TenantService tenantService;
    private final TenantMiniAppService miniAppService;

    // ============== CLIENT-API — Tenant CRUD ==============

    @GetMapping("/client-api/v1/tenants")
    public ApiResponse<List<TenantResponse>> list() {
        return ApiResponse.ok(tenantService.list());
    }

    @PostMapping("/client-api/v1/tenants")
    public ResponseEntity<ApiResponse<TenantResponse>> create(
            @Valid @RequestBody CreateTenantRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(tenantService.create(req)));
    }

    @GetMapping("/client-api/v1/tenants/{slug}")
    public ApiResponse<TenantResponse> getBySlug(@PathVariable String slug) {
        return ApiResponse.ok(tenantService.getBySlug(slug));
    }

    @PatchMapping("/client-api/v1/tenants/{slug}")
    public ApiResponse<TenantResponse> update(
            @PathVariable String slug,
            @RequestBody UpdateTenantRequest req) {
        return ApiResponse.ok(tenantService.update(slug, req));
    }

    @DeleteMapping("/client-api/v1/tenants/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        tenantService.delete(id);
        return ApiResponse.ok(null);
    }

    // ============== CLIENT-API — Tenant lifecycle ==============

    @PostMapping("/client-api/v1/tenants/{slug}/activate")
    public ApiResponse<TenantResponse> activate(@PathVariable String slug) {
        return ApiResponse.ok(tenantService.activate(slug));
    }

    @PostMapping("/client-api/v1/tenants/{slug}/suspend")
    public ApiResponse<TenantResponse> suspend(@PathVariable String slug) {
        return ApiResponse.ok(tenantService.suspend(slug));
    }

    @PostMapping("/client-api/v1/tenants/{slug}/offboard")
    public ApiResponse<TenantResponse> offboard(@PathVariable String slug) {
        return ApiResponse.ok(tenantService.offboard(slug));
    }

    // ============== CLIENT-API — Per-tenant mini-app enable ==============

    @GetMapping("/client-api/v1/tenants/{slug}/mini-apps")
    public ApiResponse<List<TenantMiniAppResponse>> listMiniApps(@PathVariable String slug) {
        return ApiResponse.ok(miniAppService.listForTenant(slug));
    }

    @PostMapping("/client-api/v1/tenants/{slug}/mini-apps")
    public ApiResponse<TenantMiniAppResponse> enableMiniApp(
            @PathVariable String slug,
            @Valid @RequestBody EnableMiniAppRequest req) {
        return ApiResponse.ok(miniAppService.enable(slug, req));
    }

    @DeleteMapping("/client-api/v1/tenants/{slug}/mini-apps/{miniAppId}")
    public ApiResponse<Void> disableMiniApp(
            @PathVariable String slug,
            @PathVariable UUID miniAppId) {
        miniAppService.delete(slug, miniAppId);
        return ApiResponse.ok(null);
    }

    // ============== SERVICE-API — Internal (tenant-manager gọi) ==============

    /**
     * Callback từ tenant-manager: báo đã init xong → đánh dấu tenant = active.
     */
    @PostMapping("/service-api/v1/internal/tenants/{slug}/initialized")
    public ApiResponse<TenantResponse> onTenantInitialized(
            @PathVariable String slug,
            @RequestBody TenantInitializedCallback cb) {
        return ApiResponse.ok(tenantService.onTenantInitialized(slug, cb));
    }
}
