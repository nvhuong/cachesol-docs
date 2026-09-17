package com.cachesol.platform.tenant.dto;

public record KeycloakUserSummary(
        String keycloakUserId,
        String username,
        String email,
        boolean enabled
) {}
