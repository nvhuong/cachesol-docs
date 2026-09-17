package com.cachesol.platform.tenant.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * User ↔ Role (per-tenant) + org_scope_path.
 * Bảng: {@code user_app_roles}.
 *
 * <p>{@code org_scope_path} NULL = áp dụng toàn tenant.
 * org_scope_path NOT NULL = chỉ áp dụng trong subtree của org đó.
 */
@Entity
@Table(name = "user_app_roles", schema = "tenant_manager")
public class UserAppRole {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "role_id", nullable = false)
    private UUID roleId;

    @Column(name = "app_code", nullable = false, length = 50)
    private String appCode;

    @Column(name = "org_scope_path", length = 500)
    private String orgScopePath;

    @Column(name = "valid_from", nullable = false)
    private Instant validFrom = Instant.now();

    @Column(name = "valid_to")
    private Instant validTo;

    @Column(name = "granted_by")
    private UUID grantedBy;

    @Column(name = "granted_at", nullable = false)
    private Instant grantedAt = Instant.now();

    public UserAppRole() {}

    public UserAppRole(UUID userId, UUID roleId, String appCode, String orgScopePath) {
        this.userId = userId;
        this.roleId = roleId;
        this.appCode = appCode;
        this.orgScopePath = orgScopePath;
    }

    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public void setUserId(UUID v) { this.userId = v; }
    public UUID getRoleId() { return roleId; }
    public void setRoleId(UUID v) { this.roleId = v; }
    public String getAppCode() { return appCode; }
    public void setAppCode(String v) { this.appCode = v; }
    public String getOrgScopePath() { return orgScopePath; }
    public void setOrgScopePath(String v) { this.orgScopePath = v; }
    public Instant getValidFrom() { return validFrom; }
    public void setValidFrom(Instant v) { this.validFrom = v; }
    public Instant getValidTo() { return validTo; }
    public void setValidTo(Instant v) { this.validTo = v; }
    public UUID getGrantedBy() { return grantedBy; }
    public void setGrantedBy(UUID v) { this.grantedBy = v; }
    public Instant getGrantedAt() { return grantedAt; }
}
