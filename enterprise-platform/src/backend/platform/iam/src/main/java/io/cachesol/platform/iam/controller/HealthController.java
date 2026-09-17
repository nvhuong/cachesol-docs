package io.cachesol.platform.iam.controller;

import io.cachesol.platform.shared.common.api.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Health + ping endpoint.
 * PUBLIC-API: {@code /public-api/v1/health}.
 */
@RestController
@RequestMapping("/public-api/v1")
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        return ApiResponse.ok(Map.of(
                "status", "UP",
                "service", "iam-service",
                "timestamp", Instant.now().toString()
        ));
    }
}
