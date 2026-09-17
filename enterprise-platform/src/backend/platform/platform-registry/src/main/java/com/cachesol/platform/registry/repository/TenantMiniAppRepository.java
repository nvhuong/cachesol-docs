package com.cachesol.platform.registry.repository;

import com.cachesol.platform.registry.entity.TenantMiniApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantMiniAppRepository extends JpaRepository<TenantMiniApp, UUID> {
    List<TenantMiniApp> findByTenantSlug(String tenantSlug);
    Optional<TenantMiniApp> findByTenantSlugAndMiniAppId(String tenantSlug, UUID miniAppId);
    void deleteByTenantSlugAndMiniAppId(String tenantSlug, UUID miniAppId);
}
