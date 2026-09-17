package com.cachesol.platform.tenant.dto;

import java.util.Set;
import java.util.UUID;

/**
 * Snapshot response từ platform-registry /service-api/v1/roles/templates.
 */
public record RoleTemplateSnapshotResponse(
        UUID id,
        String code,
        String name,
        String description,
        String category,
        boolean isDefault,
        Set<UUID> permissions   // chỉ có id, không expand
) {}
