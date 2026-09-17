package com.cachesol.platform.tenant.dto;

import com.cachesol.platform.tenant.entity.Organization;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record OrganizationResponse(
        UUID id,
        String code,
        String name,
        String orgType,
        UUID parentId,
        String path,
        int level,
        UUID managerId,
        String description,
        boolean active,
        Map<String, Object> metadata,
        Instant createdAt,
        Instant updatedAt
) {
    public static OrganizationResponse from(Organization o) {
        return new OrganizationResponse(
            o.getId(), o.getCode(), o.getName(), o.getOrgType(),
            o.getParentId(), o.getPath(), o.getLevel(), o.getManagerId(),
            o.getDescription(), o.isActive(), o.getMetadata(),
            o.getCreatedAt(), o.getUpdatedAt()
        );
    }
}
