package com.cachesol.platform.tenant.service;

import com.cachesol.platform.tenant.dto.CreateRoleRequest;
import com.cachesol.platform.tenant.dto.PermissionResponse;
import com.cachesol.platform.tenant.dto.RoleResponse;
import com.cachesol.platform.tenant.entity.Permission;
import com.cachesol.platform.tenant.entity.Role;
import com.cachesol.platform.tenant.entity.RolePermission;
import com.cachesol.platform.tenant.event.TenantEventPublisher;
import com.cachesol.platform.tenant.repository.PermissionRepository;
import com.cachesol.platform.tenant.repository.RolePermissionRepository;
import com.cachesol.platform.tenant.repository.RoleRepository;
import com.cachesol.platform.shared.common.exception.ConflictException;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository            roleRepo;
    private final PermissionRepository      permRepo;
    private final RolePermissionRepository  rpRepo;
    private final TenantEventPublisher     eventPublisher;

    public List<RoleResponse> list() {
        return roleRepo.findAll().stream()
                .map(r -> {
                    Set<UUID> permIds = rpRepo.findByRoleId(r.getId()).stream()
                            .map(rp -> rp.getPermissionId())
                            .collect(Collectors.toSet());
                    return RoleResponse.from(r, permIds);
                })
                .toList();
    }

    public RoleResponse get(UUID id) {
        Role r = roleRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Role", id.toString()));
        Set<UUID> permIds = rpRepo.findByRoleId(id).stream()
                .map(rp -> rp.getPermissionId()).collect(Collectors.toSet());
        return RoleResponse.from(r, permIds);
    }

    public RoleResponse getByCode(String code) {
        Role r = roleRepo.findByCode(code)
                .orElseThrow(() -> new NotFoundException("Role", code));
        Set<UUID> permIds = rpRepo.findByRoleId(r.getId()).stream()
                .map(rp -> rp.getPermissionId()).collect(Collectors.toSet());
        return RoleResponse.from(r, permIds);
    }

    @Transactional
    public RoleResponse create(CreateRoleRequest req) {
        if (roleRepo.findByCode(req.code).isPresent()) {
            throw new ConflictException("ROLE_EXISTS", "Role đã tồn tại: " + req.code);
        }
        Role r = new Role(req.code, req.name, req.appCode);
        r.setDescription(req.description);
        Role saved = roleRepo.save(r);

        // Attach permissions
        if (req.permissionIds != null) {
            for (UUID pid : req.permissionIds) {
                rpRepo.save(new RolePermission(saved.getId(), pid));
            }
        }
        Set<UUID> permIds = req.permissionIds != null
                ? new HashSet<>(req.permissionIds)
                : Set.of();
        eventPublisher.publishRoleAssigned("default", req.code, req.appCode);
        return RoleResponse.from(saved, permIds);
    }

    @Transactional
    public RoleResponse update(UUID id, CreateRoleRequest req) {
        Role r = roleRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Role", id.toString()));
        if (req.name         != null) r.setName(req.name);
        if (req.description  != null) r.setDescription(req.description);
        if (req.appCode     != null) r.setAppCode(req.appCode);
        Role saved = roleRepo.save(r);

        // Replace permissions
        if (req.permissionIds != null) {
            rpRepo.deleteByRoleId(id);
            for (UUID pid : req.permissionIds) {
                rpRepo.save(new RolePermission(saved.getId(), pid));
            }
        }
        Set<UUID> permIds = req.permissionIds != null
                ? new HashSet<>(req.permissionIds)
                : rpRepo.findByRoleId(id).stream().map(rp -> rp.getPermissionId()).collect(Collectors.toSet());
        return RoleResponse.from(saved, permIds);
    }

    @Transactional
    public void delete(UUID id) {
        Role r = roleRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("Role", id.toString()));
        if (r.isSystem()) {
            throw new ConflictException("SYSTEM_ROLE", "Không thể xoá system role: " + r.getCode());
        }
        rpRepo.deleteByRoleId(id);
        roleRepo.deleteById(id);
    }

    public List<PermissionResponse> listPermissions() {
        return permRepo.findAll().stream().map(PermissionResponse::from).toList();
    }

    /** Clone snapshot từ platform-registry (dùng khi init-schema). */
    @Transactional
    public int clonePermissions(List<PermissionResponse> perms) {
        int count = 0;
        for (PermissionResponse p : perms) {
            if (permRepo.findByCode(p.code()).isEmpty()) {
                permRepo.save(new Permission(p.code(), p.description(), p.category()));
                count++;
            }
        }
        return count;
    }

    /** Clone snapshot từ platform-registry (dùng khi init-schema). */
    @Transactional
    public int cloneRoles(List<com.cachesol.platform.tenant.dto.RoleTemplateSnapshotResponse> templates) {
        int count = 0;
        for (var t : templates) {
            if (roleRepo.findByCode(t.code()).isEmpty()) {
                Role r = new Role(t.code(), t.name(), t.category());
                r.setDescription(t.description());
                r.setSystem(true);
                r.setTemplateRoleId(t.id());
                Role saved = roleRepo.save(r);

                // Link permissions by code
                if (t.permissions() != null) {
                    for (UUID pid : t.permissions()) {
                        permRepo.findById(pid).ifPresent(perm -> {
                            // Find the local permission by code
                            permRepo.findByCode(perm.getCode()).ifPresent(localPerm -> {
                                rpRepo.save(new RolePermission(saved.getId(), localPerm.getId()));
                            });
                        });
                    }
                }
                count++;
            }
        }
        return count;
    }
}
