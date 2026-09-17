package com.cachesol.platform.iam.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Tạo user trong Keycloak realm.
 *
 * POST /service-api/v1/users
 * Header: X-Realm: tenant-acme   (hoặc body field realm)
 *
 * Caller: tenant-manager service (service-to-service).
 */
public class CreateKeycloakUserRequest {

    /** Optional nếu X-Realm header được truyền. */
    public String realm;

    @NotBlank @Size(min = 3, max = 100)
    public String username;

    @NotBlank @Size(min = 8, max = 100)
    public String password;

    @Email
    public String email;

    public String firstName;
    public String lastName;
    public Boolean enabled = true;

    /** Realm roles để gán (vd. ["HRM_USER","SALES_USER"]). */
    public List<String> realmRoles;
}
