package com.cachesol.platform.registry.dto;

/**
 * Response sau khi tenant được tạo thành công qua public registration endpoint.
 * Khớp với {@code RegistrationResponse} của frontend.
 */
public record PublicRegistrationResponse(
        String tenantId,
        String tenantSlug,
        String adminUrl,
        String contactEmail,
        String provisioningEta
) {}
