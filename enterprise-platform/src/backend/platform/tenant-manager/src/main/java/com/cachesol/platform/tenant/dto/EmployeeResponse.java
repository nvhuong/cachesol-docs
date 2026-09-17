package com.cachesol.platform.tenant.dto;

import com.cachesol.platform.tenant.entity.Employee;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record EmployeeResponse(
        UUID id,
        UUID userId,
        String employeeCode,
        String fullName,
        String email,
        String phone,
        java.time.LocalDate dateOfBirth,
        String gender,
        String nationalId,
        String address,
        String avatarUrl,
        String status,
        java.time.LocalDate hiredAt,
        java.time.LocalDate terminatedAt,
        Map<String, Object> metadata,
        Instant createdAt,
        Instant updatedAt
) {
    public static EmployeeResponse from(Employee e) {
        return new EmployeeResponse(
            e.getId(), e.getUserId(), e.getEmployeeCode(), e.getFullName(),
            e.getEmail(), e.getPhone(), e.getDateOfBirth(), e.getGender(),
            e.getNationalId(), e.getAddress(), e.getAvatarUrl(),
            e.getStatus(), e.getHiredAt(), e.getTerminatedAt(),
            e.getMetadata(), e.getCreatedAt(), e.getUpdatedAt()
        );
    }
}
