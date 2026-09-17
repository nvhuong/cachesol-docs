package com.cachesol.platform.tenant.service;

import com.cachesol.platform.tenant.dto.CreateEmployeeRequest;
import com.cachesol.platform.tenant.dto.EmployeeAssignmentResponse;
import com.cachesol.platform.tenant.dto.EmployeeResponse;
import com.cachesol.platform.tenant.entity.AppUser;
import com.cachesol.platform.tenant.entity.Employee;
import com.cachesol.platform.tenant.entity.EmployeeAssignment;
import com.cachesol.platform.tenant.event.TenantEventPublisher;
import com.cachesol.platform.tenant.repository.AppUserRepository;
import com.cachesol.platform.tenant.repository.EmployeeAssignmentRepository;
import com.cachesol.platform.tenant.repository.EmployeeRepository;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository         empRepo;
    private final AppUserRepository          userRepo;
    private final EmployeeAssignmentRepository eaRepo;
    private final TenantEventPublisher       eventPublisher;

    public List<EmployeeResponse> list() {
        return empRepo.findAll().stream().map(EmployeeResponse::from).toList();
    }

    public EmployeeResponse get(UUID id) {
        return EmployeeResponse.from(empRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee", id.toString())));
    }

    public EmployeeResponse getByCode(String code) {
        return EmployeeResponse.from(empRepo.findByEmployeeCode(code)
                .orElseThrow(() -> new NotFoundException("Employee", code)));
    }

    public EmployeeResponse getByUserId(UUID userId) {
        return EmployeeResponse.from(empRepo.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("Employee", "userId=" + userId)));
    }

    @Transactional
    public EmployeeResponse create(CreateEmployeeRequest req) {
        Employee e = new Employee();
        if (req.userId != null) {
            e.setUserId(req.userId);
            AppUser u = userRepo.findById(req.userId).orElse(null);
            if (u != null && req.fullName == null) e.setFullName(u.getFullName());
        }
        e.setEmployeeCode(req.employeeCode != null
                ? req.employeeCode
                : "E" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        if (req.fullName      != null) e.setFullName(req.fullName);
        if (req.email         != null) e.setEmail(req.email);
        if (req.phone         != null) e.setPhone(req.phone);
        if (req.dateOfBirth   != null) e.setDateOfBirth(req.dateOfBirth);
        if (req.gender        != null) e.setGender(req.gender);
        if (req.nationalId    != null) e.setNationalId(req.nationalId);
        if (req.address       != null) e.setAddress(req.address);
        if (req.avatarUrl     != null) e.setAvatarUrl(req.avatarUrl);
        if (req.hiredAt       != null) e.setHiredAt(req.hiredAt);
        if (req.metadata      != null) e.setMetadata(req.metadata);
        Employee saved = empRepo.save(e);

        // Initial assignment
        if (req.orgId != null) {
            EmployeeAssignment ea = new EmployeeAssignment();
            ea.setEmployeeId(saved.getId());
            ea.setOrgId(req.orgId);
            if (req.jobTitleId != null) ea.setJobTitleId(req.jobTitleId);
            if (req.reportsTo != null) ea.setReportsTo(req.reportsTo);
            ea.setStartDate(LocalDate.now());
            ea.setPrimary(req.primaryAssignment);
            eaRepo.save(ea);
            eventPublisher.publishEmployeeAssigned("default", saved.getEmployeeCode(), req.orgId.toString());
        }
        return EmployeeResponse.from(saved);
    }

    @Transactional
    public EmployeeResponse update(UUID id, CreateEmployeeRequest req) {
        Employee e = empRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Employee", id.toString()));
        if (req.fullName     != null) e.setFullName(req.fullName);
        if (req.email        != null) e.setEmail(req.email);
        if (req.phone        != null) e.setPhone(req.phone);
        if (req.dateOfBirth  != null) e.setDateOfBirth(req.dateOfBirth);
        if (req.gender       != null) e.setGender(req.gender);
        if (req.nationalId   != null) e.setNationalId(req.nationalId);
        if (req.address      != null) e.setAddress(req.address);
        if (req.avatarUrl    != null) e.setAvatarUrl(req.avatarUrl);
        if (req.status       != null) e.setStatus(req.status);
        if (req.hiredAt      != null) e.setHiredAt(req.hiredAt);
        if (req.terminatedAt != null) e.setTerminatedAt(req.terminatedAt);
        e.setUpdatedAt(Instant.now());
        return EmployeeResponse.from(empRepo.save(e));
    }

    @Transactional
    public void delete(UUID id) {
        if (!empRepo.existsById(id)) throw new NotFoundException("Employee", id.toString());
        empRepo.deleteById(id);
    }

    // ---- Assignments ----

    public List<EmployeeAssignmentResponse> listAssignments(UUID employeeId) {
        return eaRepo.findByEmployeeId(employeeId).stream()
                .map(EmployeeAssignmentResponse::from)
                .toList();
    }

    @Transactional
    public EmployeeAssignmentResponse addAssignment(UUID employeeId, CreateEmployeeRequest req) {
        if (!empRepo.existsById(employeeId)) throw new NotFoundException("Employee", employeeId.toString());
        EmployeeAssignment ea = new EmployeeAssignment();
        ea.setEmployeeId(employeeId);
        ea.setOrgId(req.orgId);
        if (req.jobTitleId != null) ea.setJobTitleId(req.jobTitleId);
        if (req.reportsTo  != null) ea.setReportsTo(req.reportsTo);
        ea.setStartDate(LocalDate.now());
        ea.setPrimary(req.primaryAssignment);
        EmployeeAssignment saved = eaRepo.save(ea);
        return EmployeeAssignmentResponse.from(saved);
    }

    @Transactional
    public void removeAssignment(UUID employeeId, UUID assignmentId) {
        if (!eaRepo.existsById(assignmentId)) throw new NotFoundException("EmployeeAssignment", assignmentId.toString());
        eaRepo.deleteById(assignmentId);
    }
}
