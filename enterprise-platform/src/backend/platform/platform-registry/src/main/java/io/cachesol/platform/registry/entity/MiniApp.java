package io.cachesol.platform.registry.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

/**
 * Mini-app được register cho tenant.
 * Bảng: {@code tenant_<slug>_platformregistry.mini_apps}.
 *
 * Skeleton — implement chi tiết ở sprint sau:
 * - module config JSONB
 * - enabled toggles
 * - versioning
 */
@Entity
@Table(name = "mini_apps")
public class MiniApp {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "code", nullable = false, length = 100)
    private String code;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "version", length = 50)
    private String version;

    @Column(name = "is_enabled", nullable = false)
    private boolean enabled = true;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public MiniApp() {}

    public MiniApp(String code, String name, String version) {
        this.code = code;
        this.name = name;
        this.version = version;
    }

    public UUID getId() { return id; }
    public String getCode() { return code; }
    public String getName() { return name; }
    public String getVersion() { return version; }
    public boolean isEnabled() { return enabled; }
    public Instant getCreatedAt() { return createdAt; }
}
