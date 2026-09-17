package com.cachesol.platform.tenant.dto;

import com.cachesol.platform.tenant.entity.UserAppRole;

import java.time.Instant;
import java.util.UUID;

public record UserAppRoleResponse(
        UUID id,
        UUID userId,
        UUID roleId,
        String appCode,
        String orgScopePath,
        Instant validFrom,
        Instant validTo,
        UUID grantedBy,
        Instant grantedAt
) {
    public static UserAppRoleResponse from(UserAppRole uar) {
        return new UserAppRoleResponse(
            uar.getId(), uar.getUserId(), uar.getRoleId(), uar.getAppCode(),
            uar.getOrgScopePath(), uar.getValidFrom(), uar.getValidTo(),
            uar.getGrantedBy(), uar.getGrantedAt()
        );
    }
}
