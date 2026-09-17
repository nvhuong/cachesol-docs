package com.cachesol.platform.registry.entity;

import jakarta.persistence.*;

import java.util.UUID;

/**
 * Permission template (cross-tenant, schema public).
 * Bảng: {@code public.permission_templates}.
 * Clone snapshot sang {@code tenant_<slug>_tenantmanager.permissions} khi tạo tenant mới.
 */
@Entity
@Table(name = "permission_templates", schema = "public")
public class PermissionTemplate {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "description")
    private String description;

    @Column(name = "category", length = 50)
    private String category;

    public PermissionTemplate() {}

    public PermissionTemplate(String code, String description, String category) {
        this.code = code;
        this.description = description;
        this.category = category;
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
}
