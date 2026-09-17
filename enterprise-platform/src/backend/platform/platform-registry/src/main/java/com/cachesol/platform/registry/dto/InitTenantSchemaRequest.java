package com.cachesol.platform.registry.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Map;
import java.util.UUID;

/**
 * Body cho internal {@code POST /service-api/v1/tenants} —
 * platform-registry orchestrator gọi (hoặc test-curl.sh) để bootstrap tenant.
 * tenant-manager cũng nhận 1 bản sao body dạng này để init schema per-tenant.
 */
public class InitTenantSchemaRequest {

    @NotNull public String slug;

    /** Mã root org (vd "ACME_ROOT") — sẽ insert vào organizations của tenant-manager. */
    public String companyCode;

    /** Tên root org. */
    public String companyName;

    /** keycloak_user_id của super-admin đầu tiên. */
    public UUID superAdminUserId;

    /** Metadata tuỳ ý. */
    public Map<String, Object> metadata;

    public InitTenantSchemaRequest() {}
}
