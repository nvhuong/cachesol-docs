package com.cachesol.platform.tenant.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Map;
import java.util.UUID;

/**
 * Request body cho internal {@code POST /service-api/v1/internal/init-schema}.
 * platform-registry orchestrator gọi khi tạo tenant mới.
 */
public class InitSchemaRequest {

    /** Slug của tenant đang init. */
    @NotNull public String slug;

    /** Code của root org (vd "ACME_ROOT"). */
    public String companyCode;

    /** Tên root org (vd "ACME Company"). */
    public String companyName;

    /** Type của root org. Default "COMPANY". */
    public String orgType = "COMPANY";

    /** keycloak_user_id của super-admin đầu tiên. */
    public UUID superAdminUserId;

    /** Tên đầy đủ super-admin. */
    public String superAdminFullName;

    /** Email super-admin. */
    public String superAdminEmail;

    /** Username super-admin. */
    public String superAdminUsername;

    /** Role code gán cho super-admin (default "COMPANY_ADMIN"). */
    public String superAdminRoleCode = "COMPANY_ADMIN";

    /** App code cho super-admin role (default "PLATFORM"). */
    public String superAdminAppCode = "PLATFORM";

    /** Metadata tuỳ ý. */
    public Map<String, Object> metadata;

    public InitSchemaRequest() {}
}
