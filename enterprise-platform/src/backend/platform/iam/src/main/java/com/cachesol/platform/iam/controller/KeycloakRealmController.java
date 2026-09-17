package com.cachesol.platform.iam.controller;

import com.cachesol.platform.iam.dto.ProvisionRealmRequest;
import com.cachesol.platform.iam.dto.ProvisionRealmResponse;
import com.cachesol.platform.iam.service.KeycloakProvisioningService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * SERVICE-API — Keycloak realm management (orchestrator cho platform-registry).
 *
 *   POST   /service-api/v1/realms/provision    → platform-registry gọi khi tạo tenant
 *   DELETE /service-api/v1/realms/{name}       → offboard tenant → xoá realm
 *   GET    /service-api/v1/realms/{name}       → inspect realm
 *
 * Không có /internal — toàn bộ API của IAM là service-to-service.
 * Không có /client-api — client không bao giờ gọi trực tiếp IAM.
 */
@RestController
@RequestMapping("/service-api/v1/realms")
@RequiredArgsConstructor
public class KeycloakRealmController {

    private final KeycloakProvisioningService service;

    @PostMapping("/provision")
    public ResponseEntity<ApiResponse<ProvisionRealmResponse>> provision(
            @Valid @RequestBody ProvisionRealmRequest req) {
        return ResponseEntity.status(201)
                .body(ApiResponse.ok(service.provisionRealm(req)));
    }

    @DeleteMapping("/{name}")
    public ApiResponse<Void> delete(@PathVariable String name) {
        service.deleteRealm(name);
        return ApiResponse.ok(null);
    }

    @GetMapping("/{name}")
    public ApiResponse<Map<String, Object>> get(@PathVariable String name) {
        return ApiResponse.ok(service.getRealm(name));
    }
}
