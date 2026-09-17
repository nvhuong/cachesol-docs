package com.cachesol.platform.iam.controller;

import com.cachesol.platform.shared.common.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Health endpoints — PUBLIC-API (no auth).
 *
 * GET /public-api/v1/health/live  → liveness probe (is JVM alive?)
 * GET /public-api/v1/health/ready → readiness probe (can serve traffic?)
 */
@RestController
@RequestMapping("/public-api/v1/health")
public class HealthController {

    @GetMapping("/live")
    public ApiResponse<Map<String, Object>> liveness() {
        return ApiResponse.ok(Map.of(
                "status", "UP",
                "service", "iam-service",
                "timestamp", Instant.now().toString()
        ));
    }

    @GetMapping("/ready")
    public ApiResponse<Map<String, Object>> readiness() {
        // TODO: add Keycloak reachability check before declaring ready
        return ApiResponse.ok(Map.of(
                "status", "UP",
                "service", "iam-service",
                "checks", Map.of(
                        "keycloak", "not-checked-yet"  // TODO: probe Keycloak /health/ready
                ),
                "timestamp", Instant.now().toString()
        ));
    }
}
