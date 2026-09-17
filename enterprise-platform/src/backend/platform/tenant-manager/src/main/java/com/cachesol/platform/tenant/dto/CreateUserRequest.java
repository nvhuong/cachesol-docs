package com.cachesol.platform.tenant.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.UUID;

public class CreateUserRequest {
    /**
     * Optional. Nếu có → tenant-manager chỉ link AppUser ↔ Keycloak user.
     * Nếu null  → tenant-manager TỰ gọi IAM tạo user mới trong Keycloak realm.
     */
    public String keycloakUserId;

    @NotBlank @Size(max = 100) public String username;
    @Email                    public String email;
    @Size(max = 200)          public String fullName;

    /**
     * Password Keycloak (chỉ dùng khi tự tạo Keycloak user).
     * Nếu null/blank và chưa có keycloakUserId → tenant-manager generate ngẫu nhiên.
     */
    public String password;

    /** Realm Keycloak để tạo user (vd. "tenant-acme"). Nếu null sẽ suy ra từ tenant. */
    public String realm;

    /** Initial roles to assign (code list, app-scoped roles trong tenant-manager). */
    public List<String> roleCodes;
    public String appCode;

    /** Realm roles tương ứng trong Keycloak (vd. "HRM_USER", "SALES_USER") — gán qua IAM. */
    public List<String> realmRoles;

    /** Optional initial org + job_title assignment. */
    public UUID orgId;
    public UUID jobTitleId;
    public UUID reportsTo;

    public CreateUserRequest() {}
}
