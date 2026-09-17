package com.cachesol.platform.registry.dto;

import com.cachesol.platform.registry.entity.RoleTemplate;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

public record RoleTemplateResponse(
        UUID id,
        String code,
        String name,
        String description,
        String category,
        boolean isDefault,
        Instant createdAt,
        Set<PermissionTemplateResponse> permissions
) {
    public static RoleTemplateResponse from(RoleTemplate r, boolean withPermissions) {
        Set<PermissionTemplateResponse> perms = withPermissions
                ? r.getPermissions().stream()
                    .map(PermissionTemplateResponse::from)
                    .collect(Collectors.toSet())
                : Set.of();
        return new RoleTemplateResponse(
                r.getId(), r.getCode(), r.getName(), r.getDescription(),
                r.getCategory(), r.isDefault(), r.getCreatedAt(), perms
        );
    }
}
