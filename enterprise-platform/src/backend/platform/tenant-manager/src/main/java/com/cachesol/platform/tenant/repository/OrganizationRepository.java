package com.cachesol.platform.tenant.repository;

import com.cachesol.platform.tenant.entity.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    Optional<Organization> findByCode(String code);
    List<Organization> findByParentId(UUID parentId);
    List<Organization> findByParentIdIsNull();     // root nodes
    List<Organization> findByActiveTrue();
}
