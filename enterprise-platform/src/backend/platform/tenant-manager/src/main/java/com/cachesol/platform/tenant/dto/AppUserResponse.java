package com.cachesol.platform.tenant.dto;

import com.cachesol.platform.tenant.entity.AppUser;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

public record AppUserResponse(
        UUID id,
        UUID keycloakUserId,
        String username,
        String email,
        String fullName,
        String status,
        boolean active,
        Instant lastLoginAt,
        Map<String, Object> metadata,
        Instant createdAt
) {
    public static AppUserResponse from(AppUser u) {
        return new AppUserResponse(
            u.getId(), u.getKeycloakUserId(), u.getUsername(), u.getEmail(),
            u.getFullName(), u.getStatus(), u.isActive(), u.getLastLoginAt(),
            u.getMetadata(), u.getCreatedAt()
        );
    }
}
