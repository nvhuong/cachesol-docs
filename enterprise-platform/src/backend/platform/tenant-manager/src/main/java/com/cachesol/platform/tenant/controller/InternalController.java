package com.cachesol.platform.tenant.controller;

import com.cachesol.platform.tenant.dto.*;
import com.cachesol.platform.tenant.service.InternalService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Internal endpoints — gọi từ platform-registry orchestrator khi tạo tenant mới.
 * Không expose ra ngoài.
 */
@Slf4j
@RestController
@RequestMapping("/service-api/v1/internal")
public class InternalController {

    private final InternalService internalService;
    private final String          platformRegistryUrl;

    public InternalController(
            InternalService internalService,
            @Value("${platform-registry.callback-url:http://platform-registry-service:8081}")
            String platformRegistryUrl) {
        this.internalService = internalService;
        this.platformRegistryUrl = platformRegistryUrl;
    }

    /**
     * POST /service-api/v1/internal/init-schema
     * platform-registry gọi để init schema per-tenant cho tenant-manager.
     */
    @PostMapping("/init-schema")
    public ResponseEntity<ApiResponse<InitSchemaResponse>> initSchema(
            @Valid @RequestBody InitSchemaRequest req) {
        InitSchemaResponse resp = internalService.initSchema(req);

        // Notify platform-registry: tenant initialized
        try {
            RestClient.create(platformRegistryUrl)
                    .post()
                    .uri("/service-api/v1/internal/tenants/{slug}/initialized",
                            req.slug)
                    .body(Map.of(
                            "hrmRootOrgId",     resp.rootOrgId(),
                            "rootOrgCode",      req.companyCode != null
                                    ? req.companyCode
                                    : (req.slug.toUpperCase() + "_ROOT"),
                            "superAdminUserId", resp.superAdminUserId() != null
                                    ? resp.superAdminUserId()
                                    : ""
                    ))
                    .retrieve();
        } catch (Exception e) {
            // Log but don't fail — platform-registry có thể check định kỳ
            log.warn("Failed to notify platform-registry after init-schema: {}", e.getMessage());
        }

        return ResponseEntity.status(201)
                .body(ApiResponse.ok(resp));
    }
}
