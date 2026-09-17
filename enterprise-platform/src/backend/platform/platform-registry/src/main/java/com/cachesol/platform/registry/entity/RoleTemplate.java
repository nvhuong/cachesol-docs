package com.cachesol.platform.registry.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Role template (cross-tenant, schema public).
 * Bảng: {@code public.role_templates}.
 */
@Entity
@Table(name = "role_templates", schema = "public")
public class RoleTemplate {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "code", nullable = false, unique = true, length = 100)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "is_default", nullable = false)
    private boolean isDefault = false;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> metadata = new HashMap<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    /**
     * Permission thuộc role template — eager-load khi clone snapshot.
     * Chỉ dùng để đọc/snapshot; không persist qua cascade.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "role_template_permissions",
        schema = "public",
        joinColumns = @JoinColumn(name = "role_template_id"),
        inverseJoinColumns = @JoinColumn(name = "permission_template_id")
    )
    private Set<PermissionTemplate> permissions = new HashSet<>();

    public RoleTemplate() {}

    public RoleTemplate(String code, String name, String category) {
        this.code = code;
        this.name = name;
        this.category = category;
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String v) { this.code = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public String getCategory() { return category; }
    public void setCategory(String v) { this.category = v; }
    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean v) { this.isDefault = v; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> v) { this.metadata = v; }
    public Instant getCreatedAt() { return createdAt; }
    public Set<PermissionTemplate> getPermissions() { return permissions; }
    public void setPermissions(Set<PermissionTemplate> v) { this.permissions = v; }
}
