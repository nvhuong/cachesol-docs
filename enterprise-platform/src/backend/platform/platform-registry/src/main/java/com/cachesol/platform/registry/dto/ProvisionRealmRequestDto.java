package com.cachesol.platform.registry.dto;

import java.util.List;

/** Body gửi sang IAM /service-api/v1/realms/provision */
public record ProvisionRealmRequestDto(
        String realm,
        String displayName,
        List<String> initialRoles,
        ProvisionSuperAdmin superAdmin
) {
    public record ProvisionSuperAdmin(
            String username,
            String email,
            String firstName,
            String lastName,
            String password,
            List<String> realmRoles
    ) {}
}
