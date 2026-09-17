package com.cachesol.platform.registry.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Per-tenant mini-app enable + config (record ở schema public — MVP).
 *
 * <p>Theo README chuẩn, bảng này nằm trong per-tenant schema
 * {@code tenant_<slug>_platformregistry.tenant_mini_apps}. MVP giữ ở public
 * keyed bằng {@code tenant_slug} để đơn giản bootstrap — production sẽ migrate
 * sang per-tenant schema qua Flyway-per-schema.
 */
@Entity
@Table(name = "tenant_mini_apps",
       schema = "public",
       uniqueConstraints = @UniqueConstraint(columnNames = {"tenant_slug", "mini_app_id"}))
public class TenantMiniApp {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "tenant_slug", nullable = false, length = 50)
    private String tenantSlug;

    @Column(name = "mini_app_id", nullable = false)
    private UUID miniAppId;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "enabled_at", nullable = false)
    private Instant enabledAt = Instant.now();

    @Column(name = "enabled_by", nullable = false)
    private UUID enabledBy;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "config", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> config = new HashMap<>();

    @Column(name = "notes", columnDefinition = "text")
    private String notes;

    public TenantMiniApp() {}

    public TenantMiniApp(String tenantSlug, UUID miniAppId, UUID enabledBy) {
        this.tenantSlug = tenantSlug;
        this.miniAppId = miniAppId;
        this.enabledBy = enabledBy;
    }

    public Instant getEnabledAt() { return enabledAt; }
    public void setEnabledAt(Instant v) { this.enabledAt = v; }
    public UUID getEnabledBy() { return enabledBy; }
    public Map<String, Object> getConfig() { return config; }
    public void setConfig(Map<String, Object> v) { this.config = v; }
    public String getNotes() { return notes; }
    public void setNotes(String v) { this.notes = v; }

    // Lombok-less getters/setters for remaining fields
    public UUID getId() { return id; }
    public String getTenantSlug() { return tenantSlug; }
    public UUID getMiniAppId() { return miniAppId; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean v) { this.enabled = v; }
}
