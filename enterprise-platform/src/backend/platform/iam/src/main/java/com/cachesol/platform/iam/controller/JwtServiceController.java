package com.cachesol.platform.iam.controller;

import com.cachesol.platform.iam.service.KeycloakProvisioningService;
import com.cachesol.platform.shared.common.api.ApiResponse;
import com.cachesol.platform.shared.common.exception.PlatformException;
import com.cachesol.platform.shared.security.jwt.AuthenticatedUser;
import com.cachesol.platform.shared.security.jwt.KeycloakJwtVerifier;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * SERVICE-API — Verify & decode JWT.
 *
 *   POST /service-api/v1/jwt/decode   → Verify token chuẩn RS256 + trích claims
 *
 * Caller: tenant-manager / gateway / bất kỳ service nào cần validate token
 *         mà không muốn tự cache JWKS.
 *
 * Header: {@code Authorization: Bearer <token>} hoặc body {@code {"token":"..."}}.
 */
@RestController
@RequestMapping("/service-api/v1/jwt")
@RequiredArgsConstructor
public class JwtServiceController {

    private final KeycloakProvisioningService provisioning;
    private final KeycloakJwtVerifier verifier;

    @PostMapping("/decode")
    public ApiResponse<Map<String, Object>> decode(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody(required = false) Map<String, String> body) {
        String token = extractToken(authHeader, body);
        AuthenticatedUser user = verifier.verify(token);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("valid", true);
        result.put("userId", user.userId());
        result.put("username", user.username());
        result.put("email", user.email());
        result.put("tenantSlug", user.tenantSlug());
        result.put("roles", user.roles());
        result.put("serviceAccount", user.serviceAccount());
        return ApiResponse.ok(result);
    }

    private String extractToken(String authHeader, Map<String, String> body) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring("Bearer ".length()).trim();
        }
        if (body != null && body.get("token") != null && !body.get("token").isBlank()) {
            return body.get("token");
        }
        throw new PlatformException("VALIDATION",
                "Provide Authorization: Bearer <token> or body {token: '...'}.");
    }
}
