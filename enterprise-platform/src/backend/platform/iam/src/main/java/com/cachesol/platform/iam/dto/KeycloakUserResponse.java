package com.cachesol.platform.iam.dto;

import java.util.List;

public record KeycloakUserResponse(
        String id,
        String username,
        String email,
        String firstName,
        String lastName,
        Boolean enabled,
        Boolean emailVerified,
        List<String> realmRoles
) {}
