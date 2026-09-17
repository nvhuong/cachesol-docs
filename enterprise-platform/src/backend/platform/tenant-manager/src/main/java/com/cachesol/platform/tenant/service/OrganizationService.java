package com.cachesol.platform.tenant.service;

import com.cachesol.platform.tenant.dto.CreateOrganizationRequest;
import com.cachesol.platform.tenant.dto.OrganizationResponse;
import com.cachesol.platform.tenant.entity.Organization;
import com.cachesol.platform.tenant.event.TenantEventPublisher;
import com.cachesol.platform.tenant.repository.OrganizationRepository;
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
public class OrganizationService {

    private final OrganizationRepository repo;
    private final TenantEventPublisher   eventPublisher;

    public List<OrganizationResponse> list() {
        return repo.findAll().stream().map(OrganizationResponse::from).toList();
    }

    public List<OrganizationResponse> listActive() {
        return repo.findByActiveTrue().stream().map(OrganizationResponse::from).toList();
    }

    /** Lấy toàn bộ cây (các root node + con cháu). */
    public List<OrganizationResponse> tree() {
        return repo.findByParentIdIsNull().stream()
                .map(OrganizationResponse::from)
                .toList();
    }

    public OrganizationResponse getById(UUID id) {
        return OrganizationResponse.from(repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Organization", id.toString())));
    }

    public OrganizationResponse getByCode(String code) {
        return OrganizationResponse.from(repo.findByCode(code)
                .orElseThrow(() -> new NotFoundException("Organization", code)));
    }

    @Transactional
    public OrganizationResponse create(CreateOrganizationRequest req) {
        if (repo.findByCode(req.code).isPresent()) {
            throw new ConflictException("ORG_EXISTS", "Organization đã tồn tại: " + req.code);
        }
        Organization parent = null;
        String path;
        int level;
        if (req.parentId != null) {
            parent = repo.findById(req.parentId)
                    .orElseThrow(() -> new NotFoundException("Organization", req.parentId.toString()));
            path = parent.getPath() + "." + req.code.toLowerCase();
            level = parent.getLevel() + 1;
        } else {
            path = req.code.toLowerCase();
            level = 0;
        }
        Organization o = new Organization();
        o.setCode(req.code);
        o.setName(req.name);
        o.setOrgType(req.orgType);
        o.setParentId(req.parentId);
        o.setPath(path);
        o.setLevel(level);
        o.setDescription(req.description);
        if (req.managerId != null) o.setManagerId(req.managerId);
        Organization saved = repo.save(o);
        eventPublisher.publishOrgCreated("default", saved.getCode());
        return OrganizationResponse.from(saved);
    }

    @Transactional
    public OrganizationResponse update(UUID id, CreateOrganizationRequest req) {
        Organization o = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Organization", id.toString()));
        if (req.name         != null) o.setName(req.name);
        if (req.orgType     != null) o.setOrgType(req.orgType);
        if (req.description != null) o.setDescription(req.description);
        if (req.managerId   != null) o.setManagerId(req.managerId);
        o.setUpdatedAt(Instant.now());
        return OrganizationResponse.from(repo.save(o));
    }

    @Transactional
    public OrganizationResponse move(UUID id, UUID newParentId) {
        Organization o = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Organization", id.toString()));
        if (newParentId == null) {
            // Move to root
            o.setParentId(null);
            o.setPath(o.getCode().toLowerCase());
            o.setLevel(0);
        } else {
            Organization newParent = repo.findById(newParentId)
                    .orElseThrow(() -> new NotFoundException("Organization", newParentId.toString()));
            o.setParentId(newParentId);
            o.setPath(newParent.getPath() + "." + o.getCode().toLowerCase());
            o.setLevel(newParent.getLevel() + 1);
        }
        o.setUpdatedAt(Instant.now());
        // TODO: update path for all descendants (recursive CTE)
        return OrganizationResponse.from(repo.save(o));
    }

    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) throw new NotFoundException("Organization", id.toString());
        repo.deleteById(id);
    }

    public List<OrganizationResponse> children(UUID parentId) {
        return repo.findByParentId(parentId).stream()
                .map(OrganizationResponse::from)
                .toList();
    }

    /** Lấy toàn bộ descendants (cháu) — MVP: recursive filter. */
    public List<OrganizationResponse> descendants(UUID parentId) {
        Organization parent = repo.findById(parentId)
                .orElseThrow(() -> new NotFoundException("Organization", parentId.toString()));
        String prefix = parent.getPath() + ".";
        return repo.findAll().stream()
                .filter(o -> o.getPath() != null && o.getPath().startsWith(prefix))
                .map(OrganizationResponse::from)
                .toList();
    }
}
