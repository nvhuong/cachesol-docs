package com.cachesol.platform.tenant.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Employee ↔ Organization ↔ JobTitle (n-n-n).
 * Bảng: {@code employee_assignments}.
 */
@Entity
@Table(name = "employee_assignments", schema = "tenant_manager")
public class EmployeeAssignment {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "employee_id", nullable = false)
    private UUID employeeId;

    @Column(name = "org_id", nullable = false)
    private UUID orgId;

    @Column(name = "job_title_id")
    private UUID jobTitleId;

    @Column(name = "is_primary", nullable = false)
    private boolean primary = false;

    @Column(name = "start_date", nullable = false)
    private java.time.LocalDate startDate;

    @Column(name = "end_date")
    private java.time.LocalDate endDate;

    @Column(name = "reports_to")
    private UUID reportsTo;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public EmployeeAssignment() {}

    public EmployeeAssignment(UUID employeeId, UUID orgId, UUID jobTitleId, UUID reportsTo) {
        this.employeeId = employeeId;
        this.orgId = orgId;
        this.jobTitleId = jobTitleId;
        this.reportsTo = reportsTo;
    }

    public UUID getId() { return id; }
    public UUID getEmployeeId() { return employeeId; }
    public void setEmployeeId(UUID v) { this.employeeId = v; }
    public UUID getOrgId() { return orgId; }
    public void setOrgId(UUID v) { this.orgId = v; }
    public UUID getJobTitleId() { return jobTitleId; }
    public void setJobTitleId(UUID v) { this.jobTitleId = v; }
    public boolean isPrimary() { return primary; }
    public void setPrimary(boolean v) { this.primary = v; }
    public java.time.LocalDate getStartDate() { return startDate; }
    public void setStartDate(java.time.LocalDate v) { this.startDate = v; }
    public java.time.LocalDate getEndDate() { return endDate; }
    public void setEndDate(java.time.LocalDate v) { this.endDate = v; }
    public UUID getReportsTo() { return reportsTo; }
    public void setReportsTo(UUID v) { this.reportsTo = v; }
    public Instant getCreatedAt() { return createdAt; }
}
