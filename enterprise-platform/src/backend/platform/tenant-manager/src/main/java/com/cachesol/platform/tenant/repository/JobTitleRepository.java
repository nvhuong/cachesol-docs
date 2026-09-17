package com.cachesol.platform.tenant.repository;

import com.cachesol.platform.tenant.entity.JobTitle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobTitleRepository extends JpaRepository<JobTitle, UUID> {
    Optional<JobTitle> findByCode(String code);
}
