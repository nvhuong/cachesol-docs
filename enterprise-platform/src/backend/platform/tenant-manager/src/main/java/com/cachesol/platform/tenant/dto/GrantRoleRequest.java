package com.cachesol.platform.tenant.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

/**
 * Request để gán role cho user.
 */
public class GrantRoleRequest {
    @NotBlank public String roleCode;
    @NotBlank public String appCode;
    /** Org path scope — null = toàn tenant. */
    public String orgScopePath;

    public GrantRoleRequest() {}
}
