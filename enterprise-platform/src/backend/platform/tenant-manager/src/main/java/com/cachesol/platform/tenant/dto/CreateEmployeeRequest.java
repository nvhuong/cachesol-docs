package com.cachesol.platform.tenant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;
import java.util.UUID;

/**
 * Employee full CRUD request.
 */
public class CreateEmployeeRequest {
    public UUID userId;

    /** Employee code (MNV-001). Nếu null → tự sinh. */
    public String employeeCode;

    @NotBlank @Size(max = 255) public String fullName;
    public String email;
    public String phone;
    public java.time.LocalDate dateOfBirth;
    public String gender;
    public String nationalId;
    public String address;
    public String avatarUrl;
    public String status;
    public java.time.LocalDate hiredAt;
    public java.time.LocalDate terminatedAt;

    /** Initial assignment. */
    public UUID orgId;
    public UUID jobTitleId;
    public UUID reportsTo;
    public boolean primaryAssignment;

    public Map<String, Object> metadata;

    public CreateEmployeeRequest() {}
}
