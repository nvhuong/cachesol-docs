package com.cachesol.platform.hrm.application.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateEmployeeRequest {
    @NotBlank
    @Size(max = 20)
    private String employeeCode;

    @NotBlank
    @Size(max = 100)
    private String firstName;

    @NotBlank
    @Size(max = 100)
    private String lastName;

    @NotBlank
    @Email
    private String email;

    @Size(max = 20)
    private String phone;

    private LocalDate dateOfBirth;

    @NotNull
    private LocalDate dateOfJoining;

    @NotBlank
    private String employmentType;
}
