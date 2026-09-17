package com.cachesol.platform.tenant.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request để gán role cho user (cả 2 phía: tenant_manager.user_app_roles + keycloak.realm_role).
 */
public class GrantRoleRequest {
    @NotBlank public String roleCode;
    @NotBlank public String appCode;

    /** Org path scope — null = toàn tenant. */
    public String orgScopePath;

    /** Realm Keycloak tương ứng (vd. "tenant-acme"). Dùng để gọi IAM gán realm role. */
    public String realm;

    public GrantRoleRequest() {}
}
