package com.cachesol.platform.tenant.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Organization tree node (cây đơn vị).
 * Bảng: {@code organizations}.
 *
 * <p>Path format: dot-separated, vd "acme_root.hcmc.sales_dept".
 */
@Entity
@Table(name = "organizations", schema = "tenant_manager")
public class Organization {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "org_type", nullable = false, length = 30)
    private String orgType;

    @Column(name = "parent_id")
    private UUID parentId;

    @Column(name = "path", length = 500)
    private String path;

    @Column(name = "level", nullable = false)
    private int level = 0;

    @Column(name = "manager_id")
    private UUID managerId;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> metadata = new HashMap<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public Organization() {}

    public Organization(String code, String name, String orgType, UUID parentId, int level, String path) {
        this.code = code;
        this.name = name;
        this.orgType = orgType;
        this.parentId = parentId;
        this.level = level;
        this.path = path;
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String v) { this.code = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getOrgType() { return orgType; }
    public void setOrgType(String v) { this.orgType = v; }
    public UUID getParentId() { return parentId; }
    public void setParentId(UUID v) { this.parentId = v; }
    public String getPath() { return path; }
    public void setPath(String v) { this.path = v; }
    public int getLevel() { return level; }
    public void setLevel(int v) { this.level = v; }
    public UUID getManagerId() { return managerId; }
    public void setManagerId(UUID v) { this.managerId = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public boolean isActive() { return active; }
    public void setActive(boolean v) { this.active = v; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> v) { this.metadata = v; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant v) { this.updatedAt = v; }
}
