package com.cachesol.platform.registry.dto;

import java.util.List;

public record ProvisionRealmResponseDto(
        String realm,
        boolean created,
        List<String> rolesCreated,
        List<String> rolesExisted,
        SuperAdminResponse superAdmin
) {
    public record SuperAdminResponse(
            String keycloakUserId,
            String username,
            List<String> realmRoles
    ) {}
}
