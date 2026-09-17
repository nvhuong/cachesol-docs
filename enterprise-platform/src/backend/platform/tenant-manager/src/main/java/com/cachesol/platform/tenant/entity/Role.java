package com.cachesol.platform.tenant.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.UUID;

/**
 * Role (per-tenant) — clone snapshot từ platform-registry role_templates.
 * Bảng: {@code roles}.
 */
@Entity
@Table(name = "roles", schema = "tenant_manager")
public class Role {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "app_code", length = 50)
    private String appCode;

    @Column(name = "is_system", nullable = false)
    private boolean system = false;

    /** Ref sang platform-registry.role_templates (nullable). */
    @Column(name = "template_role_id")
    private UUID templateRoleId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Role() {}

    public Role(String code, String name, String appCode) {
        this.code = code;
        this.name = name;
        this.appCode = appCode;
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String v) { this.code = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public String getAppCode() { return appCode; }
    public void setAppCode(String v) { this.appCode = v; }
    public boolean isSystem() { return system; }
    public void setSystem(boolean v) { this.system = v; }
    public UUID getTemplateRoleId() { return templateRoleId; }
    public void setTemplateRoleId(UUID v) { this.templateRoleId = v; }
    public Instant getCreatedAt() { return createdAt; }
}
