package com.cachesol.platform.registry.dto;

import com.cachesol.platform.registry.entity.TenantMiniApp;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record TenantMiniAppResponse(
        UUID id,
        String tenantSlug,
        UUID miniAppId,
        boolean enabled,
        Instant enabledAt,
        Map<String, Object> config,
        String notes
) {
    public static TenantMiniAppResponse from(TenantMiniApp t) {
        return new TenantMiniAppResponse(
            t.getId(), t.getTenantSlug(), t.getMiniAppId(), t.isEnabled(),
            t.getEnabledAt(), t.getConfig(), t.getNotes()
        );
    }
}
