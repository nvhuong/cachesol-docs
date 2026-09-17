package com.cachesol.platform.registry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;
import java.util.UUID;

public class CreateRoleTemplateRequest {
    @NotBlank @Size(max = 100) public String code;
    @NotBlank public String name;
    public String description;
    public String category;
    public boolean isDefault;          // default false
    public Set<UUID> permissionIds;    // permission_template ids

    public CreateRoleTemplateRequest() {}
}
