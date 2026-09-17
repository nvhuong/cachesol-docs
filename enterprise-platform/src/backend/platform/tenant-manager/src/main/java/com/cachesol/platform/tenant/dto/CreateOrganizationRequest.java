package com.cachesol.platform.tenant.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

/**
 * Request body cho {@code POST /client-api/v1/organizations}.
 */
public class CreateOrganizationRequest {
    @NotBlank public String code;
    @NotBlank public String name;
    @NotBlank public String orgType;           // COMPANY | SUBSIDIARY | BRANCH | CENTER | DEPARTMENT | TEAM
    public UUID parentId;
    public String description;
    public UUID managerId;

    public CreateOrganizationRequest() {}
}
