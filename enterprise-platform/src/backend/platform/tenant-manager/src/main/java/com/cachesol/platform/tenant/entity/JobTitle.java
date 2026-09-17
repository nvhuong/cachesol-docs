package com.cachesol.platform.tenant.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Job title (chức danh).
 * Bảng: {@code job_titles}.
 */
@Entity
@Table(name = "job_titles", schema = "tenant_manager")
public class JobTitle {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "level", nullable = false)
    private int level = 0;

    @Column(name = "is_leader", nullable = false)
    private boolean leader = false;

    @Column(name = "scope_org_id")
    private UUID scopeOrgId;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public JobTitle() {}

    public JobTitle(String code, String name, int level, boolean leader) {
        this.code = code;
        this.name = name;
        this.level = level;
        this.leader = leader;
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String v) { this.code = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public int getLevel() { return level; }
    public void setLevel(int v) { this.level = v; }
    public boolean isLeader() { return leader; }
    public void setLeader(boolean v) { this.leader = v; }
    public UUID getScopeOrgId() { return scopeOrgId; }
    public void setScopeOrgId(UUID v) { this.scopeOrgId = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public boolean isActive() { return active; }
    public void setActive(boolean v) { this.active = v; }
    public Instant getCreatedAt() { return createdAt; }
}
