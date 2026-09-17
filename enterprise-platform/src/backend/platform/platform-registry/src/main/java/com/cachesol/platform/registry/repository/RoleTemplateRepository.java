package com.cachesol.platform.registry.repository;

import com.cachesol.platform.registry.entity.RoleTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoleTemplateRepository extends JpaRepository<RoleTemplate, UUID> {
    Optional<RoleTemplate> findByCode(String code);
    List<RoleTemplate> findByIsDefaultTrue();
}
