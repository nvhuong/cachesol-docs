package io.cachesol.platform.tenant.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Employee — đại diện cho 1 user trong tổ chức tenant.
 * Bảng: {@code tenant_<slug>_tenantmanager.employees}.
 *
 * Skeleton — implement chi tiết: job_title_id, employment_status, ... ở sprint sau.
 */
@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "keycloak_user_id", nullable = false, length = 100)
    private String keycloakUserId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "email", length = 255)
    private String email;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "hired_at")
    private Instant hiredAt;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Employee() {}

    public Employee(String keycloakUserId, String fullName, String email) {
        this.keycloakUserId = keycloakUserId;
        this.fullName = fullName;
        this.email = email;
        this.hiredAt = Instant.now();
    }

    public UUID getId() { return id; }
    public String getKeycloakUserId() { return keycloakUserId; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public boolean isActive() { return active; }
    public Instant getHiredAt() { return hiredAt; }
    public Instant getCreatedAt() { return createdAt; }
}
