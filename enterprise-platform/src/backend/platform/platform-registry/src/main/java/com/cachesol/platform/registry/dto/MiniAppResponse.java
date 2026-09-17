package com.cachesol.platform.registry.dto;

import com.cachesol.platform.registry.entity.MiniApp;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record MiniAppResponse(
        UUID id,
        String code,
        String name,
        String description,
        String version,
        String category,
        String iconUrl,
        String documentationUrl,
        BigDecimal basePrice,
        boolean core,
        boolean active,
        Instant createdAt,
        Instant updatedAt
) {
    public static MiniAppResponse from(MiniApp m) {
        return new MiniAppResponse(
            m.getId(), m.getCode(), m.getName(), m.getDescription(),
            m.getVersion(), m.getCategory(), m.getIconUrl(), m.getDocumentationUrl(),
            m.getBasePrice(), m.isCore(), m.isActive(),
            m.getCreatedAt(), m.getUpdatedAt()
        );
    }
}
