package com.cachesol.platform.registry.dto;

import java.util.UUID;

/**
 * Payload gửi sang tenant-manager {@code POST /service-api/v1/internal/init-schema}.
 * Đồng bộ với {@code com.cachesol.platform.tenant.dto.InitSchemaRequest}.
 */
public class InitTenantSchemaRequestDto {

    public String slug;
    public String companyCode;
    public String companyName;
    public String orgType;
    public UUID superAdminUserId;
    public String superAdminFullName;
    public String superAdminEmail;
    public String superAdminUsername;
    public String superAdminRoleCode;
    public String superAdminAppCode;

    public InitTenantSchemaRequestDto() {}

    /** Factory cho tenant vừa register, chưa có super-admin user provisioned. */
    public static InitTenantSchemaRequestDto forNewTenant(String slug, String displayName) {
        InitTenantSchemaRequestDto req = new InitTenantSchemaRequestDto();
        req.slug = slug;
        req.companyCode = slug.toUpperCase() + "_ROOT";
        req.companyName = displayName;
        req.orgType = "COMPANY";
        // superAdminUserId=null → tenant-manager sẽ skip user creation block
        req.superAdminRoleCode = "COMPANY_ADMIN";
        req.superAdminAppCode = "PLATFORM";
        return req;
    }
}
