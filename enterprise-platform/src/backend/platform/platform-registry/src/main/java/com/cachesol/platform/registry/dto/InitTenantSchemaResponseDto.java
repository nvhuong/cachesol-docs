package com.cachesol.platform.registry.dto;

import java.util.UUID;

/**
 * Response từ tenant-manager sau khi init-schema xong.
 * Đồng bộ với {@code com.cachesol.platform.tenant.dto.InitSchemaResponse}.
 */
public record InitTenantSchemaResponseDto(
        String slug,
        String schemaName,
        UUID rootOrgId,
        UUID superAdminUserId,
        int rolesCloned,
        int permissionsCloned
) {}
