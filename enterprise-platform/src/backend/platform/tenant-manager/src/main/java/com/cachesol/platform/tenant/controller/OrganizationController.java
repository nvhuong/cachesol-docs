package com.cachesol.platform.tenant.controller;

import com.cachesol.platform.tenant.dto.CreateOrganizationRequest;
import com.cachesol.platform.tenant.dto.OrganizationResponse;
import com.cachesol.platform.tenant.service.OrganizationService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/client-api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService service;

    @GetMapping
    public ApiResponse<List<OrganizationResponse>> list() {
        return ApiResponse.ok(service.list());
    }

    @GetMapping("/tree")
    public ApiResponse<List<OrganizationResponse>> tree() {
        return ApiResponse.ok(service.tree());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrganizationResponse>> create(
            @Valid @RequestBody CreateOrganizationRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(service.create(req)));
    }

    @GetMapping("/{id}")
    public ApiResponse<OrganizationResponse> get(@PathVariable UUID id) {
        return ApiResponse.ok(service.getById(id));
    }

    @GetMapping("/by-code/{code}")
    public ApiResponse<OrganizationResponse> byCode(@PathVariable String code) {
        return ApiResponse.ok(service.getByCode(code));
    }

    @PatchMapping("/{id}")
    public ApiResponse<OrganizationResponse> update(
            @PathVariable UUID id,
            @RequestBody CreateOrganizationRequest req) {
        return ApiResponse.ok(service.update(id, req));
    }

    @PostMapping("/{id}/move")
    public ApiResponse<OrganizationResponse> move(
            @PathVariable UUID id,
            @RequestParam(required = false) UUID parentId) {
        return ApiResponse.ok(service.move(id, parentId));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ApiResponse.ok(null);
    }

    @GetMapping("/{id}/children")
    public ApiResponse<List<OrganizationResponse>> children(@PathVariable UUID id) {
        return ApiResponse.ok(service.children(id));
    }

    @GetMapping("/{id}/descendants")
    public ApiResponse<List<OrganizationResponse>> descendants(@PathVariable UUID id) {
        return ApiResponse.ok(service.descendants(id));
    }
}
