package com.cachesol.platform.tenant.dto;

import java.util.List;

/** Body gửi sang IAM /service-api/v1/users (Keycloak user create). */
public record CreateKeycloakUserFromTenantRequest(
        String username,
        String password,
        String email,
        String firstName,
        String lastName,
        Boolean enabled,
        List<String> realmRoles
) {
    public static CreateKeycloakUserFromTenantRequest of(String username, String password,
                                                          String email, String fullName,
                                                          List<String> realmRoles) {
        String first = null, last = null;
        if (fullName != null) {
            int idx = fullName.indexOf(' ');
            if (idx > 0) { first = fullName.substring(0, idx); last = fullName.substring(idx + 1); }
            else { first = fullName; }
        }
        return new CreateKeycloakUserFromTenantRequest(
                username, password, email, first, last, Boolean.TRUE, realmRoles);
    }
}
