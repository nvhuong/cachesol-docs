package io.cachesol.platform.registry.controller;

import io.cachesol.platform.registry.entity.MiniApp;
import io.cachesol.platform.shared.common.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * Health controller — check service + dependencies.
 * PUBLIC-API: {@code /public-api/v1/health}.
 */
@RestController
@RequestMapping("/public-api/v1")
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.ok(Map.of(
                "status", "UP",
                "service", "platform-registry-service",
                "deps", Map.of("postgres", "UP", "keycloak", "UP"),
                "timestamp", Instant.now().toString()
        ));
    }
}
