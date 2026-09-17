package com.cachesol.platform.tenant.repository;

import com.cachesol.platform.tenant.entity.UserAppRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserAppRoleRepository extends JpaRepository<UserAppRole, UUID> {
    List<UserAppRole> findByUserId(UUID userId);
    List<UserAppRole> findByUserIdAndAppCode(UUID userId, String appCode);
}
