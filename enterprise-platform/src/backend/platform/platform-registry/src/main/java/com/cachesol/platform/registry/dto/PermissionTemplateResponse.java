package com.cachesol.platform.registry.dto;

import com.cachesol.platform.registry.entity.PermissionTemplate;

import java.util.UUID;

public record PermissionTemplateResponse(
        UUID id,
        String code,
        String description,
        String category
) {
    public static PermissionTemplateResponse from(PermissionTemplate p) {
        return new PermissionTemplateResponse(p.getId(), p.getCode(), p.getDescription(), p.getCategory());
    }
}
