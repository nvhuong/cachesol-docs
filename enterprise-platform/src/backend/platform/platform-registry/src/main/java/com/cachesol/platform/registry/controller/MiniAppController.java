package com.cachesol.platform.registry.controller;

import com.cachesol.platform.registry.dto.CreateMiniAppRequest;
import com.cachesol.platform.registry.dto.MiniAppResponse;
import com.cachesol.platform.registry.service.MiniAppService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class MiniAppController {

    private final MiniAppService service;

    // ============== PUBLIC-API ==============

    /**
     * Public catalog — ai cũng đọc được.
     */
    @GetMapping("/public-api/v1/mini-apps/catalog")
    public ApiResponse<List<MiniAppResponse>> catalog() {
        return ApiResponse.ok(service.listActive());
    }

    // ============== CLIENT-API ==============

    @GetMapping("/client-api/v1/mini-apps")
    public ApiResponse<List<MiniAppResponse>> list() {
        return ApiResponse.ok(service.list());
    }

    @PostMapping("/client-api/v1/mini-apps")
    public ResponseEntity<ApiResponse<MiniAppResponse>> register(
            @Valid @RequestBody CreateMiniAppRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(service.register(req)));
    }

    @GetMapping("/client-api/v1/mini-apps/{id}")
    public ApiResponse<MiniAppResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.get(id));
    }

    @GetMapping("/client-api/v1/mini-apps/by-code/{code}")
    public ApiResponse<MiniAppResponse> getByCode(@PathVariable String code) {
        return ApiResponse.ok(service.getByCode(code));
    }

    @PatchMapping("/client-api/v1/mini-apps/{id}")
    public ApiResponse<MiniAppResponse> update(
            @PathVariable UUID id,
            @RequestBody CreateMiniAppRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    @DeleteMapping("/client-api/v1/mini-apps/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }
}
