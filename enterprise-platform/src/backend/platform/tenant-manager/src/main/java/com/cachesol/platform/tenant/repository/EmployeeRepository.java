package com.cachesol.platform.tenant.repository;

import com.cachesol.platform.tenant.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {
    Optional<Employee> findByUserId(UUID userId);
    Optional<Employee> findByEmployeeCode(String code);
    List<Employee> findByStatus(String status);
}
