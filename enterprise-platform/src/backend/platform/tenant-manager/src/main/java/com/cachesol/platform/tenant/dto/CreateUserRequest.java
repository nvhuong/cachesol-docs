package com.cachesol.platform.tenant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateUserRequest {
    @NotBlank public String keycloakUserId;   // string UUID
    @NotBlank @Size(max = 100) public String username;
    public String email;
    public String fullName;

    /** Initial roles to assign (code list). */
    public java.util.List<String> roleCodes;
    public String appCode;

    /** Optional initial org + job_title assignment. */
    public UUID orgId;
    public UUID jobTitleId;
    public UUID reportsTo;

    public CreateUserRequest() {}
}
