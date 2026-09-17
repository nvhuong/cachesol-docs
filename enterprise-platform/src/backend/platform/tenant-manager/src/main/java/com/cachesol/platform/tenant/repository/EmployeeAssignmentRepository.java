package com.cachesol.platform.tenant.repository;

import com.cachesol.platform.tenant.entity.EmployeeAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EmployeeAssignmentRepository extends JpaRepository<EmployeeAssignment, UUID> {
    List<EmployeeAssignment> findByEmployeeId(UUID employeeId);
    List<EmployeeAssignment> findByOrgId(UUID orgId);
    List<EmployeeAssignment> findByReportsTo(UUID reportsTo);
}
