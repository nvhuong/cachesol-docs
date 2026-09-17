package com.cachesol.platform.tenant.dto;

import com.cachesol.platform.tenant.entity.Permission;

import java.util.UUID;

public record PermissionResponse(UUID id, String code, String description, String category) {
    public static PermissionResponse from(Permission p) {
        return new PermissionResponse(p.getId(), p.getCode(), p.getDescription(), p.getCategory());
    }
}
