package com.cachesol.platform.tenant.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Employee record — liên kết với AppUser.
 * Bảng: {@code employees}.
 */
@Entity
@Table(name = "employees", schema = "tenant_manager")
public class Employee {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "employee_code", nullable = false, unique = true, length = 50)
    private String employeeCode;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "date_of_birth")
    private java.time.LocalDate dateOfBirth;

    @Column(name = "gender", length = 10)
    private String gender;

    @Column(name = "national_id", length = 30)
    private String nationalId;

    @Column(name = "address", columnDefinition = "text")
    private String address;

    @Column(name = "avatar_url", columnDefinition = "text")
    private String avatarUrl;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE";   // ACTIVE | INACTIVE | TERMINATED

    @Column(name = "hired_at")
    private java.time.LocalDate hiredAt;

    @Column(name = "terminated_at")
    private java.time.LocalDate terminatedAt;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> metadata = new HashMap<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Employee() {}

    public Employee(UUID userId, String employeeCode, String fullName) {
        this.userId = userId;
        this.employeeCode = employeeCode;
        this.fullName = fullName;
    }

    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID v) { this.userId = v; }
    public String getEmployeeCode() { return employeeCode; }
    public void setEmployeeCode(String v) { this.employeeCode = v; }
    public String getFullName() { return fullName; }
    public void setFullName(String v) { this.fullName = v; }
    public String getEmail() { return email; }
    public void setEmail(String v) { this.email = v; }
    public String getPhone() { return phone; }
    public void setPhone(String v) { this.phone = v; }
    public java.time.LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(java.time.LocalDate v) { this.dateOfBirth = v; }
    public String getGender() { return gender; }
    public void setGender(String v) { this.gender = v; }
    public String getNationalId() { return nationalId; }
    public void setNationalId(String v) { this.nationalId = v; }
    public String getAddress() { return address; }
    public void setAddress(String v) { this.address = v; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String v) { this.avatarUrl = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public java.time.LocalDate getHiredAt() { return hiredAt; }
    public void setHiredAt(java.time.LocalDate v) { this.hiredAt = v; }
    public java.time.LocalDate getTerminatedAt() { return terminatedAt; }
    public void setTerminatedAt(java.time.LocalDate v) { this.terminatedAt = v; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> v) { this.metadata = v; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant v) { this.updatedAt = v; }
}
