package com.cachesol.platform.iam.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Request payload để provision một Keycloak realm mới.
 *
 * POST /service-api/v1/internal/realms/provision
 */
public class ProvisionRealmRequest {

    @NotBlank
    @Size(min = 3, max = 50)
    public String realm;

    public String displayName;

    /**
     * Keycloak login theme for this realm (e.g. "acme-theme", "globex-theme").
     * Must match a directory name under {@code themes/} that Keycloak can find
     * (mounted at {@code /opt/keycloak/themes} in docker-compose).
     * Optional — omit to use Keycloak default theme.
     */
    public String loginTheme;

    /** Initial realm-level roles để tạo cùng realm (vd. COMPANY_ADMIN, HRM_USER). */
    public List<String> initialRoles;

    /** Optional: tạo super-admin user ngay sau khi realm được tạo. */
    public ProvisionSuperAdmin superAdmin;

    public static class ProvisionSuperAdmin {
        public String username;
        public String email;
        public String firstName;
        public String lastName;
        public String password;
        public List<String> realmRoles;
    }
}
