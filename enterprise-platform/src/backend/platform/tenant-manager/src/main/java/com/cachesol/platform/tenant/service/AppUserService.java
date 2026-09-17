package com.cachesol.platform.tenant.service;

import com.cachesol.platform.tenant.dto.CreateUserRequest;
import com.cachesol.platform.tenant.dto.AppUserResponse;
import com.cachesol.platform.tenant.dto.GrantRoleRequest;
import com.cachesol.platform.tenant.dto.UserAppRoleResponse;
import com.cachesol.platform.tenant.entity.AppUser;
import com.cachesol.platform.tenant.entity.Employee;
import com.cachesol.platform.tenant.entity.EmployeeAssignment;
import com.cachesol.platform.tenant.entity.Role;
import com.cachesol.platform.tenant.entity.UserAppRole;
import com.cachesol.platform.tenant.event.TenantEventPublisher;
import com.cachesol.platform.tenant.repository.*;
import com.cachesol.platform.shared.common.exception.ConflictException;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppUserService {

    private final AppUserRepository        userRepo;
    private final RoleRepository            roleRepo;
    private final UserAppRoleRepository    userAppRoleRepo;
    private final EmployeeRepository        empRepo;
    private final EmployeeAssignmentRepository eaRepo;
    private final TenantEventPublisher     eventPublisher;

    public List<AppUserResponse> list() {
        return userRepo.findAll().stream().map(AppUserResponse::from).toList();
    }

    public AppUserResponse findById(UUID id) {
        return AppUserResponse.from(userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString())));
    }

    public AppUserResponse findByUsername(String username) {
        return AppUserResponse.from(userRepo.findByUsername(username)
                .orElseThrow(() -> new NotFoundException("AppUser", username)));
    }

    public AppUserResponse findByKeycloakUserId(UUID kcUserId) {
        return AppUserResponse.from(userRepo.findByKeycloakUserId(kcUserId)
                .orElseThrow(() -> new NotFoundException("AppUser", "kcUserId=" + kcUserId)));
    }

    @Transactional
    public AppUserResponse create(CreateUserRequest req) {
        UUID kcId = UUID.fromString(req.keycloakUserId);
        if (userRepo.existsByKeycloakUserId(kcId)) {
            throw new ConflictException("USER_EXISTS", "User đã tồn tại: " + req.keycloakUserId);
        }
        if (userRepo.existsByUsername(req.username)) {
            throw new ConflictException("USER_EXISTS", "Username đã tồn tại: " + req.username);
        }

        AppUser user = new AppUser();
        user.setKeycloakUserId(kcId);
        user.setUsername(req.username);
        user.setEmail(req.email);
        user.setFullName(req.fullName);
        AppUser saved = userRepo.save(user);
        eventPublisher.publishUserCreated("default", saved.getUsername());

        // Auto tạo employee record
        Employee emp = new Employee(saved.getId(),
                "EMP-" + saved.getId().toString().substring(0, 8).toUpperCase(),
                saved.getFullName() != null ? saved.getFullName() : saved.getUsername());
        if (saved.getEmail() != null) emp.setEmail(saved.getEmail());
        Employee savedEmp = empRepo.save(emp);

        // Gán roles
        if (req.roleCodes != null && req.appCode != null) {
            for (String roleCode : req.roleCodes) {
                roleRepo.findByCode(roleCode).ifPresent(role -> {
                    UserAppRole uar = new UserAppRole(saved.getId(), role.getId(), req.appCode, null);
                    uar.setGrantedBy(saved.getId());
                    userAppRoleRepo.save(uar);
                    eventPublisher.publishRoleAssigned("default", saved.getUsername(), roleCode);
                });
            }
        }

        // Gán org assignment
        if (req.orgId != null) {
            EmployeeAssignment ea = new EmployeeAssignment();
            ea.setEmployeeId(savedEmp.getId());
            ea.setOrgId(req.orgId);
            ea.setStartDate(java.time.LocalDate.now());
            ea.setReportsTo(req.reportsTo);
            ea.setPrimary(true);
            eaRepo.save(ea);
            eventPublisher.publishEmployeeAssigned("default", savedEmp.getEmployeeCode(), req.orgId.toString());
        }

        return AppUserResponse.from(saved);
    }

    @Transactional
    public AppUserResponse update(UUID id, CreateUserRequest req) {
        AppUser u = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString()));
        if (req.email    != null) u.setEmail(req.email);
        if (req.fullName != null) u.setFullName(req.fullName);
        u.setUpdatedAt(Instant.now());
        return AppUserResponse.from(userRepo.save(u));
    }

    @Transactional
    public void delete(UUID id) {
        if (!userRepo.existsById(id)) throw new NotFoundException("AppUser", id.toString());
        userRepo.deleteById(id);
    }

    @Transactional
    public AppUserResponse deactivate(UUID id) {
        AppUser u = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString()));
        u.setActive(false);
        u.setStatus("INACTIVE");
        return AppUserResponse.from(userRepo.save(u));
    }

    @Transactional
    public AppUserResponse activate(UUID id) {
        AppUser u = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("AppUser", id.toString()));
        u.setActive(true);
        u.setStatus("ACTIVE");
        return AppUserResponse.from(userRepo.save(u));
    }

    // ---- User ↔ Roles ----

    public List<UserAppRoleResponse> listUserRoles(UUID userId) {
        return userAppRoleRepo.findByUserId(userId).stream()
                .map(UserAppRoleResponse::from)
                .toList();
    }

    @Transactional
    public UserAppRoleResponse grantRole(UUID userId, GrantRoleRequest req) {
        if (!userRepo.existsById(userId)) throw new NotFoundException("AppUser", userId.toString());
        Role role = roleRepo.findByCode(req.roleCode)
                .orElseThrow(() -> new NotFoundException("Role", req.roleCode));
        UserAppRole uar = new UserAppRole(userId, role.getId(), req.appCode, req.orgScopePath);
        uar.setGrantedBy(userId);
        UserAppRole saved = userAppRoleRepo.save(uar);
        eventPublisher.publishRoleAssigned("default", userRepo.findById(userId).map(AppUser::getUsername).orElse("?"), req.roleCode);
        return UserAppRoleResponse.from(saved);
    }

    @Transactional
    public void revokeRole(UUID userId, UUID uarId) {
        if (!userAppRoleRepo.existsById(uarId)) throw new NotFoundException("UserAppRole", uarId.toString());
        userAppRoleRepo.deleteById(uarId);
    }
}
