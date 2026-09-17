package com.cachesol.platform.tenant.dto;

import java.util.UUID;

/**
 * Response của internal init-schema endpoint.
 */
public record InitSchemaResponse(
        String slug,
        String schemaName,
        UUID rootOrgId,
        UUID superAdminUserId,
        int rolesCloned,
        int permissionsCloned
) {}
