package com.cachesol.platform.tenant.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Role ↔ Permission (n-n).
 * Bảng: {@code role_permissions}.
 */
@Entity
@Table(name = "role_permissions", schema = "tenant_manager")
public class RolePermission {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(name = "role_id", nullable = false)
    private UUID roleId;

    @Column(name = "permission_id", nullable = false)
    private UUID permissionId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public RolePermission() {}

    public RolePermission(UUID roleId, UUID permissionId) {
        this.roleId = roleId;
        this.permissionId = permissionId;
    }

    public UUID getId() { return id; }
    public UUID getRoleId() { return roleId; }
    public UUID getPermissionId() { return permissionId; }
    public Instant getCreatedAt() { return createdAt; }
}
