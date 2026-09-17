package com.cachesol.platform.registry.repository;

import com.cachesol.platform.registry.entity.MiniApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MiniAppRepository extends JpaRepository<MiniApp, UUID> {
    Optional<MiniApp> findByCode(String code);
    List<MiniApp> findByActiveTrue();
}
