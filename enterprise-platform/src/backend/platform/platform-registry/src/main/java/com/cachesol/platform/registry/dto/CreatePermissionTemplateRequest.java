package com.cachesol.platform.registry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreatePermissionTemplateRequest {
    @NotBlank @Size(max = 100) public String code;
    public String description;
    public String category;

    public CreatePermissionTemplateRequest() {}
}
