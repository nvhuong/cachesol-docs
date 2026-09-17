package com.cachesol.platform.tenant.service;

import com.cachesol.platform.tenant.client.PlatformRegistryClient;
import com.cachesol.platform.tenant.dto.*;
import com.cachesol.platform.tenant.entity.*;
import com.cachesol.platform.tenant.event.TenantEventPublisher;
import com.cachesol.platform.tenant.repository.*;
import com.cachesol.platform.shared.common.exception.ConflictException;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.UUID;

/**
 * Internal service: khởi tạo schema + clone role template snapshot cho tenant mới.
 * Được gọi từ platform-registry orchestrator qua {@code POST /service-api/v1/internal/init-schema}.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InternalService {

    private final RoleService              roleService;
    private final OrganizationService      orgService;
    private final AppUserRepository       userRepo;
    private final EmployeeRepository      empRepo;
    private final RoleRepository          roleRepo;
    private final UserAppRoleRepository   userAppRoleRepo;
    private final EmployeeAssignmentRepository eaRepo;
    private final PlatformRegistryClient  platformClient;
    private final TenantEventPublisher   eventPublisher;

    /**
     * Init schema cho 1 tenant mới:
     * 1. Clone permission templates từ platform-registry
     * 2. Clone role templates từ platform-registry
     * 3. Tạo root organization (COMPANY)
     * 4. Tạo super-admin user + gán COMPANY_ADMIN role
     * 5. Notify platform-registry qua callback
     */
    @Transactional
    public InitSchemaResponse initSchema(InitSchemaRequest req) {
        log.info("Bắt đầu init schema cho tenant: {}", req.slug);

        // 1. Clone permission templates
        List<PermissionResponse> perms = platformClient.getPermissionTemplates();
        int permCount = roleService.clonePermissions(perms);
        log.info("Cloned {} permissions cho tenant {}", permCount, req.slug);

        // 2. Clone role templates
        List<RoleTemplateSnapshotResponse> templates = platformClient.getRoleTemplates();
        int roleCount = roleService.cloneRoles(templates);
        log.info("Cloned {} roles cho tenant {}", roleCount, req.slug);

        // 3. Tạo root organization
        CreateOrganizationRequest orgReq = new CreateOrganizationRequest();
        orgReq.code = req.companyCode != null ? req.companyCode : (req.slug.toUpperCase() + "_ROOT");
        orgReq.name = req.companyName != null ? req.companyName : ("Root Organization of " + req.slug);
        orgReq.orgType = req.orgType != null ? req.orgType : "COMPANY";
        OrganizationResponse rootOrg = orgService.create(orgReq);
        log.info("Created root org {} cho tenant {}", rootOrg.code(), req.slug);

        UUID superAdminUserId = null;
        // 4. Tạo super-admin user nếu có
        if (req.superAdminUserId != null) {
            // Upsert user
            AppUser user = userRepo.findByKeycloakUserId(req.superAdminUserId)
                    .orElseGet(() -> {
                        AppUser u = new AppUser();
                        u.setKeycloakUserId(req.superAdminUserId);
                        u.setUsername(req.superAdminUsername != null ? req.superAdminUsername : "admin");
                        u.setEmail(req.superAdminEmail);
                        u.setFullName(req.superAdminFullName != null ? req.superAdminFullName : "Super Admin");
                        u.setActive(true);
                        u.setStatus("ACTIVE");
                        return userRepo.save(u);
                    });
            superAdminUserId = user.getId();

            // Tạo employee record
            Employee emp = new Employee(user.getId(),
                    "EMP-" + req.slug.toUpperCase().substring(0, Math.min(4, req.slug.length())) + "-001",
                    user.getFullName());
            emp.setEmail(user.getEmail());
            emp.setHiredAt(java.time.LocalDate.now());
            Employee savedEmp = empRepo.save(emp);

            // Assign vào root org
            EmployeeAssignment ea = new EmployeeAssignment();
            ea.setEmployeeId(savedEmp.getId());
            ea.setOrgId(rootOrg.id());
            ea.setStartDate(java.time.LocalDate.now());
            ea.setPrimary(true);
            eaRepo.save(ea);

            // 5. Gán COMPANY_ADMIN role
            String roleCode = req.superAdminRoleCode != null ? req.superAdminRoleCode : "COMPANY_ADMIN";
            roleRepo.findByCode(roleCode).ifPresent(role -> {
                UserAppRole uar = new UserAppRole(user.getId(), role.getId(), req.superAdminAppCode, rootOrg.path());
                uar.setGrantedBy(user.getId());
                userAppRoleRepo.save(uar);
                log.info("Granted {} to super-admin {} for tenant {}", roleCode, user.getUsername(), req.slug);
            });
        }

        log.info("Init schema hoàn tất cho tenant {}", req.slug);
        return new InitSchemaResponse(
                req.slug,
                "tenant_" + req.slug,
                rootOrg.id(),
                superAdminUserId,
                roleCount,
                permCount
        );
    }
}
