package com.cachesol.platform.iam.dto;

import java.util.List;

/**
 * Response payload sau khi provision thành công.
 */
public record ProvisionRealmResponse(
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
