package com.cachesol.platform.tenant.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Set;
import java.util.UUID;

/**
 * Request body cho {@code POST /client-api/v1/roles}.
 */
public class CreateRoleRequest {
    @NotBlank public String code;
    @NotBlank public String name;
    public String description;
    @NotBlank public String appCode;
    /** Permission ids để gán vào role mới. */
    public Set<UUID> permissionIds;

    public CreateRoleRequest() {}
}
