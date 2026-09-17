package com.cachesol.platform.tenant.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Atomic permission (per-tenant) — clone snapshot từ platform-registry permission_templates.
 * Bảng: {@code permissions}.
 */
@Entity
@Table(name = "permissions", schema = "tenant_manager")
public class Permission {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "description")
    private String description;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Permission() {}

    public Permission(String code, String description, String category) {
        this.code = code;
        this.description = description;
        this.category = category;
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public Instant getCreatedAt() { return createdAt; }
}
