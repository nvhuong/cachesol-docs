package com.cachesol.platform.tenant.repository;

import com.cachesol.platform.tenant.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, UUID> {
    Optional<AppUser> findByKeycloakUserId(UUID keycloakUserId);
    Optional<AppUser> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByKeycloakUserId(UUID keycloakUserId);
}
