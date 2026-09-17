package io.cachesol.platform.iam.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * JWT verify cache record — log lần cuối JWT token nào đã được verify thành công.
 * (Skeleton — chỉ giữ 1 entity mẫu. Implement chi tiết: revocation list, refresh window, ... ở sprint sau.)
 */
@Entity
@Table(name = "jwt_verify_log")
public class JwtVerifyLog {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "jwt_id", nullable = false, length = 100)
    private String jwtId;

    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "tenant_slug", length = 100)
    private String tenantSlug;

    @Column(name = "verified_at", nullable = false)
    private Instant verifiedAt;

    @Column(name = "ip_address", length = 64)
    private String ipAddress;

    public JwtVerifyLog() {}

    public JwtVerifyLog(String jwtId, UUID userId, String tenantSlug, String ipAddress) {
        this.jwtId = jwtId;
        this.userId = userId;
        this.tenantSlug = tenantSlug;
        this.ipAddress = ipAddress;
        this.verifiedAt = Instant.now();
    }

    // getters
    public UUID getId() { return id; }
    public String getJwtId() { return jwtId; }
    public UUID getUserId() { return userId; }
    public String getTenantSlug() { return tenantSlug; }
    public Instant getVerifiedAt() { return verifiedAt; }
    public String getIpAddress() { return ipAddress; }
}
