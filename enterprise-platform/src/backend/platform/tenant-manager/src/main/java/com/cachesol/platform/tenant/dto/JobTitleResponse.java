package com.cachesol.platform.tenant.dto;

import com.cachesol.platform.tenant.entity.JobTitle;

import java.time.Instant;
import java.util.UUID;

public record JobTitleResponse(
        UUID id,
        String code,
        String name,
        int level,
        boolean isLeader,
        UUID scopeOrgId,
        String description,
        boolean active,
        Instant createdAt
) {
    public static JobTitleResponse from(JobTitle j) {
        return new JobTitleResponse(
            j.getId(), j.getCode(), j.getName(), j.getLevel(),
            j.isLeader(), j.getScopeOrgId(), j.getDescription(),
            j.isActive(), j.getCreatedAt()
        );
    }
}
