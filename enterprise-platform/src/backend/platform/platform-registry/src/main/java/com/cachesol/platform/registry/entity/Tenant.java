package com.cachesol.platform.registry.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Tenant record ở schema public (cross-tenant).
 * Bảng: {@code public.tenants}.
 *
 * <p>Mỗi tenant có 2 per-tenant schemas:
 * <ul>
 *   <li>{@code tenant_<slug>_platformregistry} — mini-apps enabled cho tenant + root-org mapping</li>
 *   <li>{@code tenant_<slug>_tenantmanager} — users/roles/orgs/employees (do tenant-manager tạo)</li>
 * </ul>
 */
@Entity
@Table(name = "tenants", schema = "public")
public class Tenant {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "slug", nullable = false, unique = true, length = 50)
    private String slug;

    @Column(name = "schema_name", nullable = false, unique = true, length = 63)
    private String schemaName;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "legal_name")
    private String legalName;

    @Column(name = "tax_code", length = 50)
    private String taxCode;

    @Column(name = "plan", nullable = false, length = 20)
    private String plan = "trial";

    @Column(name = "status", nullable = false, length = 20)
    private String status = "active";

    @Column(name = "region", nullable = false, length = 20)
    private String region = "vn";

    @Column(name = "keycloak_realm", nullable = false, length = 50)
    private String keycloakRealm;

    @Column(name = "default_locale", nullable = false, length = 10)
    private String defaultLocale = "vi";

    @Column(name = "default_currency", nullable = false, length = 10)
    private String defaultCurrency = "VND";

    @Column(name = "default_timezone", nullable = false, length = 50)
    private String defaultTimezone = "Asia/Ho_Chi_Minh";

    @Column(name = "contact_email", nullable = false)
    private String contactEmail;

    @Column(name = "contact_phone", length = 50)
    private String contactPhone;

    @Column(name = "login_flow_alias", length = 50)
    private String loginFlowAlias;

    @Column(name = "role_template_id")
    private UUID roleTemplateId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "metadata", columnDefinition = "jsonb", nullable = false)
    private Map<String, Object> metadata = new HashMap<>();

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "activated_at")
    private Instant activatedAt;

    @Column(name = "suspended_at")
    private Instant suspendedAt;

    @Column(name = "offboarded_at")
    private Instant offboardedAt;

    public Tenant() {}

    public UUID getId() { return id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getSchemaName() { return schemaName; }
    public void setSchemaName(String v) { this.schemaName = v; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String v) { this.displayName = v; }
    public String getLegalName() { return legalName; }
    public void setLegalName(String v) { this.legalName = v; }
    public String getTaxCode() { return taxCode; }
    public void setTaxCode(String v) { this.taxCode = v; }
    public String getPlan() { return plan; }
    public void setPlan(String v) { this.plan = v; }
    public String getStatus() { return status; }
    public void setStatus(String v) { this.status = v; }
    public String getRegion() { return region; }
    public void setRegion(String v) { this.region = v; }
    public String getKeycloakRealm() { return keycloakRealm; }
    public void setKeycloakRealm(String v) { this.keycloakRealm = v; }
    public String getDefaultLocale() { return defaultLocale; }
    public void setDefaultLocale(String v) { this.defaultLocale = v; }
    public String getDefaultCurrency() { return defaultCurrency; }
    public void setDefaultCurrency(String v) { this.defaultCurrency = v; }
    public String getDefaultTimezone() { return defaultTimezone; }
    public void setDefaultTimezone(String v) { this.defaultTimezone = v; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String v) { this.contactEmail = v; }
    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String v) { this.contactPhone = v; }
    public String getLoginFlowAlias() { return loginFlowAlias; }
    public void setLoginFlowAlias(String v) { this.loginFlowAlias = v; }
    public UUID getRoleTemplateId() { return roleTemplateId; }
    public void setRoleTemplateId(UUID v) { this.roleTemplateId = v; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> v) { this.metadata = v; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getActivatedAt() { return activatedAt; }
    public void setActivatedAt(Instant v) { this.activatedAt = v; }
    public Instant getSuspendedAt() { return suspendedAt; }
    public void setSuspendedAt(Instant v) { this.suspendedAt = v; }
    public Instant getOffboardedAt() { return offboardedAt; }
    public void setOffboardedAt(Instant v) { this.offboardedAt = v; }
}
