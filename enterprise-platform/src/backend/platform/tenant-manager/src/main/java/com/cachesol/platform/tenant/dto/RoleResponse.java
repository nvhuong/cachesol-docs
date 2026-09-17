package com.cachesol.platform.tenant.dto;

import com.cachesol.platform.tenant.entity.Role;
import com.cachesol.platform.tenant.entity.Permission;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record RoleResponse(
        UUID id,
        String code,
        String name,
        String description,
        String appCode,
        boolean system,
        UUID templateRoleId,
        Set<UUID> permissionIds,
        Instant createdAt
) {
    public static RoleResponse from(Role r, Set<UUID> permIds) {
        return new RoleResponse(
            r.getId(), r.getCode(), r.getName(), r.getDescription(),
            r.getAppCode(), r.isSystem(), r.getTemplateRoleId(),
            permIds, r.getCreatedAt()
        );
    }
}
