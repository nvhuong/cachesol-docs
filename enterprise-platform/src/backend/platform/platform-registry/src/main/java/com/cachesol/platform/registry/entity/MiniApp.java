package com.cachesol.platform.registry.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Mini-app catalog (cross-tenant, schema public).
 * Bảng: {@code public.mini_apps}.
 */
@Entity
@Table(name = "mini_apps", schema = "public")
public class MiniApp {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "version", nullable = false, length = 20)
    private String version = "0.0.1";

    @Column(name = "category", nullable = false, length = 50)
    private String category = "OTHER";

    @Column(name = "icon_url", columnDefinition = "text")
    private String iconUrl;

    @Column(name = "documentation_url", columnDefinition = "text")
    private String documentationUrl;

    @Column(name = "base_price", precision = 12, scale = 2)
    private java.math.BigDecimal basePrice;

    @Column(name = "is_core", nullable = false)
    private boolean core = false;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> metadata = new HashMap<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public MiniApp() {}

    public MiniApp(String code, String name, String version) {
        this.code = code;
        this.name = name;
        this.version = version;
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String v) { this.code = v; }
    public String getName() { return name; }
    public void setName(String v) { this.name = v; }
    public String getDescription() { return description; }
    public void setDescription(String v) { this.description = v; }
    public String getVersion() { return version; }
    public void setVersion(String v) { this.version = v; this.updatedAt = Instant.now(); }
    public String getCategory() { return category; }
    public void setCategory(String v) { this.category = v; }
    public String getIconUrl() { return iconUrl; }
    public void setIconUrl(String v) { this.iconUrl = v; }
    public String getDocumentationUrl() { return documentationUrl; }
    public void setDocumentationUrl(String v) { this.documentationUrl = v; }
    public java.math.BigDecimal getBasePrice() { return basePrice; }
    public void setBasePrice(java.math.BigDecimal v) { this.basePrice = v; }
    public boolean isCore() { return core; }
    public void setCore(boolean v) { this.core = v; }
    public boolean isActive() { return active; }
    public void setActive(boolean v) { this.active = v; this.updatedAt = Instant.now(); }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> v) { this.metadata = v; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
