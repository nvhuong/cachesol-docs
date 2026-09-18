package com.cachesol.platform.registry.dto;

import java.util.List;

/**
 * Body gửi sang IAM /service-api/v1/realms/provision
 */
public record ProvisionRealmRequestDto(
        String realm,
        String displayName,
        List<String> initialRoles,
        ProvisionSuperAdmin superAdmin,
        String loginTheme
) {
    public record ProvisionSuperAdmin(
            String username,
            String email,
            String firstName,
            String lastName,
            String password,
            List<String> realmRoles
    ) {}

    /** Builder-style factory: convention loginTheme = "{slug}-theme". */
    public static ProvisionRealmRequestDto forTenant(
            String realm, String displayName, String slug, List<String> initialRoles) {
        return new ProvisionRealmRequestDto(
                realm,
                displayName,
                initialRoles,
                null,
                slug + "-theme"
        );
    }
}
