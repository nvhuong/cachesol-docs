package com.cachesol.platform.registry.repository;

import com.cachesol.platform.registry.entity.PermissionTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PermissionTemplateRepository extends JpaRepository<PermissionTemplate, UUID> {
    Optional<PermissionTemplate> findByCode(String code);
}
