package com.cachesol.platform.registry.repository;

import com.cachesol.platform.registry.entity.TenantRootOrg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TenantRootOrgRepository extends JpaRepository<TenantRootOrg, String> {
    Optional<TenantRootOrg> findByTenantSlug(String tenantSlug);
}
