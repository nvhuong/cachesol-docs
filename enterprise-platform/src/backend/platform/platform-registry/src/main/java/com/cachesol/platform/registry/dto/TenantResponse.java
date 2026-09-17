package com.cachesol.platform.registry.dto;

import com.cachesol.platform.registry.entity.Tenant;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record TenantResponse(
        UUID id,
        String slug,
        String schemaName,
        String displayName,
        String legalName,
        String taxCode,
        String plan,
        String status,
        String region,
        String keycloakRealm,
        String defaultLocale,
        String defaultCurrency,
        String defaultTimezone,
        String contactEmail,
        String contactPhone,
        String loginFlowAlias,
        UUID roleTemplateId,
        Map<String, Object> metadata,
        Instant createdAt,
        Instant activatedAt,
        Instant suspendedAt,
        Instant offboardedAt
) {
    public static TenantResponse from(Tenant t) {
        return new TenantResponse(
            t.getId(), t.getSlug(), t.getSchemaName(), t.getDisplayName(),
            t.getLegalName(), t.getTaxCode(), t.getPlan(), t.getStatus(),
            t.getRegion(), t.getKeycloakRealm(),
            t.getDefaultLocale(), t.getDefaultCurrency(), t.getDefaultTimezone(),
            t.getContactEmail(), t.getContactPhone(), t.getLoginFlowAlias(),
            t.getRoleTemplateId(), t.getMetadata(),
            t.getCreatedAt(), t.getActivatedAt(), t.getSuspendedAt(), t.getOffboardedAt()
        );
    }
}
