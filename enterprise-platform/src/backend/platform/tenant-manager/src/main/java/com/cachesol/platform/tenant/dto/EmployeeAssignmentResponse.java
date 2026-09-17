package com.cachesol.platform.tenant.dto;

import com.cachesol.platform.tenant.entity.EmployeeAssignment;

import java.time.Instant;
import java.util.UUID;

public record EmployeeAssignmentResponse(
        UUID id,
        UUID employeeId,
        UUID orgId,
        UUID jobTitleId,
        boolean isPrimary,
        java.time.LocalDate startDate,
        java.time.LocalDate endDate,
        UUID reportsTo,
        Instant createdAt
) {
    public static EmployeeAssignmentResponse from(EmployeeAssignment a) {
        return new EmployeeAssignmentResponse(
            a.getId(), a.getEmployeeId(), a.getOrgId(), a.getJobTitleId(),
            a.isPrimary(), a.getStartDate(), a.getEndDate(),
            a.getReportsTo(), a.getCreatedAt()
        );
    }
}
