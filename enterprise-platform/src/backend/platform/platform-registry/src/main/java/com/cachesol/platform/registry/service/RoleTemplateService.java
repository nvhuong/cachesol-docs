package com.cachesol.platform.registry.service;

import com.cachesol.platform.registry.dto.CreateRoleTemplateRequest;
import com.cachesol.platform.registry.dto.PermissionTemplateResponse;
import com.cachesol.platform.registry.dto.RoleTemplateResponse;
import com.cachesol.platform.registry.entity.PermissionTemplate;
import com.cachesol.platform.registry.entity.RoleTemplate;
import com.cachesol.platform.registry.repository.PermissionTemplateRepository;
import com.cachesol.platform.registry.repository.RoleTemplateRepository;
import com.cachesol.platform.shared.common.exception.ConflictException;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RoleTemplateService {

    private final RoleTemplateRepository roleRepo;
    private final PermissionTemplateRepository permRepo;

    public List<RoleTemplateResponse> list() {
        return roleRepo.findAll().stream()
                .map(r -> RoleTemplateResponse.from(r, false))
                .toList();
    }

    public RoleTemplateResponse get(UUID id) {
        RoleTemplate r = roleRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("RoleTemplate", id.toString()));
        return RoleTemplateResponse.from(r, true);
    }

    @Transactional
    public RoleTemplateResponse create(CreateRoleTemplateRequest req) {
        if (roleRepo.findByCode(req.code).isPresent()) {
            throw new ConflictException("ROLE_ALREADY_EXISTS", "Role template đã tồn tại: " + req.code);
        }
        RoleTemplate r = new RoleTemplate(req.code, req.name, req.category);
        r.setDescription(req.description);
        r.setDefault(req.isDefault);

        if (req.permissionIds != null && !req.permissionIds.isEmpty()) {
            Set<PermissionTemplate> perms = new HashSet<>();
            for (UUID pid : req.permissionIds) {
                permRepo.findById(pid).ifPresent(perms::add);
            }
            r.setPermissions(perms);
        }
        return RoleTemplateResponse.from(roleRepo.save(r), true);
    }

    @Transactional
    public RoleTemplateResponse update(UUID id, CreateRoleTemplateRequest req) {
        RoleTemplate r = roleRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("RoleTemplate", id.toString()));

        if (req.name != null) r.setName(req.name);
        if (req.description != null) r.setDescription(req.description);
        if (req.category != null) r.setCategory(req.category);
        if (req.permissionIds != null) {
            Set<PermissionTemplate> perms = new HashSet<>();
            for (UUID pid : req.permissionIds) {
                permRepo.findById(pid).ifPresent(perms::add);
            }
            r.setPermissions(perms);
        }
        return RoleTemplateResponse.from(roleRepo.save(r), true);
    }

    @Transactional
    public void delete(UUID id) {
        if (!roleRepo.existsById(id)) throw new NotFoundException("RoleTemplate", id.toString());
        roleRepo.deleteById(id);
    }

    @Transactional
    public RoleTemplateResponse setDefault(UUID id) {
        RoleTemplate r = roleRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("RoleTemplate", id.toString()));
        // Unset current defaults
        roleRepo.findByIsDefaultTrue().forEach(existing -> {
            existing.setDefault(false);
            roleRepo.save(existing);
        });
        r.setDefault(true);
        return RoleTemplateResponse.from(roleRepo.save(r), true);
    }

    /** Clone snapshot cho service-api — không eager-load permissions. */
    public List<RoleTemplateResponse> listForServiceApi() {
        return roleRepo.findAll().stream()
                .map(r -> RoleTemplateResponse.from(r, false))
                .toList();
    }

    public List<PermissionTemplateResponse> getPermissionTemplates() {
        return permRepo.findAll().stream()
                .map(PermissionTemplateResponse::from)
                .toList();
    }
}
