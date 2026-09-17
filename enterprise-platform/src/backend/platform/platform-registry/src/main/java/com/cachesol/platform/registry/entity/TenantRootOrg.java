package com.cachesol.platform.registry.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Org-root mapping: tenant ↔ root organization trong tenant-manager.
 *
 * <p>Giúp platform-registry lookup nhanh "tenant nào ↔ root org nào" mà không cần
 * gọi service-api sang tenant-manager mỗi lần. Bảng {@code tenant_root_orgs}.
 */
@Entity
@Table(name = "tenant_root_orgs", schema = "public")
public class TenantRootOrg {

    @Id
    @Column(name = "root_org_code", nullable = false, length = 50)
    private String rootOrgCode;

    @Column(name = "tenant_slug", nullable = false, length = 50)
    private String tenantSlug;

    @Column(name = "hrm_root_org_id", nullable = false)
    private UUID hrmRootOrgId;

    @Column(name = "hrm_employee_id")
    private UUID hrmEmployeeId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> metadata = new HashMap<>();

    @Column(name = "synced_at", nullable = false)
    private Instant syncedAt = Instant.now();

    public TenantRootOrg() {}

    public TenantRootOrg(String rootOrgCode, String tenantSlug, UUID hrmRootOrgId) {
        this.rootOrgCode = rootOrgCode;
        this.tenantSlug = tenantSlug;
        this.hrmRootOrgId = hrmRootOrgId;
    }

    public String getRootOrgCode() { return rootOrgCode; }
    public void setRootOrgCode(String v) { this.rootOrgCode = v; }
    public String getTenantSlug() { return tenantSlug; }
    public void setTenantSlug(String v) { this.tenantSlug = v; }
    public UUID getHrmRootOrgId() { return hrmRootOrgId; }
    public void setHrmRootOrgId(UUID v) { this.hrmRootOrgId = v; }
    public UUID getHrmEmployeeId() { return hrmEmployeeId; }
    public void setHrmEmployeeId(UUID v) { this.hrmEmployeeId = v; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> v) { this.metadata = v; }
    public Instant getSyncedAt() { return syncedAt; }
    public void setSyncedAt(Instant v) { this.syncedAt = v; }
}
