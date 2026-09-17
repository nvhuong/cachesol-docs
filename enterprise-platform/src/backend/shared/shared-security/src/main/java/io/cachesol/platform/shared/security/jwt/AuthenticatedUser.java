package io.cachesol.platform.shared.security.jwt;

import java.util.Set;
import java.util.UUID;

/**
 * Authenticated principal — extract từ JWT.
 * Dùng chung cho cả user JWT (client-api) và service JWT (service-api).
 */
public record AuthenticatedUser(
        UUID userId,
        String username,
        String email,
        String tenantSlug,
        Set<String> roles,
        boolean serviceAccount
) {
    public boolean hasRole(String role) {
        return roles != null && roles.contains(role);
    }
}
