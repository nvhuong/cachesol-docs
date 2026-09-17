package com.cachesol.platform.registry.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

/**
 * Internal callback body từ tenant-manager → platform-registry sau khi
 * init schema xong, để cập nhật {@code tenants.status = 'active'} và ghi
 * {@code tenant_root_orgs}.
 */
public class TenantInitializedCallback {

    @NotNull public UUID hrmRootOrgId;

    /** Mã root org (vd "ACME_ROOT"). */
    @NotNull public String rootOrgCode;

    public UUID superAdminUserId;

    public TenantInitializedCallback() {}

    public UUID getHrmRootOrgId() { return hrmRootOrgId; }
    public String getRootOrgCode() { return rootOrgCode; }
    public UUID getSuperAdminUserId() { return superAdminUserId; }
}
