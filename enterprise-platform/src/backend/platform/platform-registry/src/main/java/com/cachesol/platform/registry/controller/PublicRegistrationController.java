package com.cachesol.platform.registry.controller;

import com.cachesol.platform.registry.dto.PublicRegistrationRequest;
import com.cachesol.platform.registry.dto.PublicRegistrationResponse;
import com.cachesol.platform.registry.service.PublicRegistrationService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public tenant registration endpoint — landing page (no authentication required).
 *
 * <p>Endpoint: {@code POST /public-api/v1/tenants/register}
 *
 * <p>Body: {@link PublicRegistrationRequest} — JSON nested company/contact/subscription/consents.
 * Response: {@link PublicRegistrationResponse} — tenantId, tenantSlug, adminUrl, provisioningEta.
 *
 * <p>Sau khi tenant được tạo (status=provisioning), tenant-manager sẽ listen event
 * hoặc được trigger qua callback để init schema per-tenant.
 */
@RestController
@RequestMapping("/public-api/v1/tenants")
@RequiredArgsConstructor
public class PublicRegistrationController {

    private final PublicRegistrationService service;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<PublicRegistrationResponse>> register(
            @Valid @RequestBody PublicRegistrationRequest req) {
        PublicRegistrationResponse resp = service.register(req);
        return ResponseEntity.status(201).body(ApiResponse.ok(resp));
    }
}
