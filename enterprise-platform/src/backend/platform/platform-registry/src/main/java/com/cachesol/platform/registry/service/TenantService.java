package com.cachesol.platform.registry.service;

import com.cachesol.platform.registry.dto.*;
import com.cachesol.platform.registry.entity.Tenant;
import com.cachesol.platform.registry.entity.TenantRootOrg;
import com.cachesol.platform.registry.event.TenantEventPublisher;
import com.cachesol.platform.registry.exception.TenantAlreadyExistsException;
import com.cachesol.platform.registry.repository.TenantRepository;
import com.cachesol.platform.registry.repository.TenantRootOrgRepository;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TenantService {

    private final TenantRepository       repo;
    private final TenantRootOrgRepository rootOrgRepo;
    private final TenantEventPublisher   eventPublisher;

    public List<TenantResponse> list() {
        return repo.findAll().stream().map(TenantResponse::from).toList();
    }

    public TenantResponse getBySlug(String slug) {
        return TenantResponse.from(repo.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Tenant", slug)));
    }

    public TenantResponse getById(UUID id) {
        return TenantResponse.from(repo.findById(id)
                .orElseThrow(() -> new NotFoundException("Tenant", id.toString())));
    }

    @Transactional
    public TenantResponse create(CreateTenantRequest req) {
        if (repo.existsBySlug(req.slug)) {
            throw new TenantAlreadyExistsException(req.slug);
        }
        Tenant t = new Tenant();
        t.setSlug(req.slug);
        t.setSchemaName("tenant_" + req.slug);
        t.setDisplayName(req.displayName);
        t.setLegalName(req.legalName);
        t.setTaxCode(req.taxCode);
        t.setPlan(req.plan != null ? req.plan : "trial");
        t.setRegion(req.region != null ? req.region : "vn");
        t.setKeycloakRealm(req.keycloakRealm);
        t.setDefaultLocale(req.defaultLocale != null ? req.defaultLocale : "vi");
        t.setDefaultCurrency(req.defaultCurrency != null ? req.defaultCurrency : "VND");
        t.setDefaultTimezone(req.defaultTimezone != null ? req.defaultTimezone : "Asia/Ho_Chi_Minh");
        t.setContactEmail(req.contactEmail);
        t.setContactPhone(req.contactPhone);
        t.setLoginFlowAlias(req.loginFlowAlias);
        t.setRoleTemplateId(req.roleTemplateId);
        t.setMetadata(req.metadata != null ? req.metadata : new HashMap<>());

        Tenant saved = repo.save(t);
        eventPublisher.publishCreated(saved.getSlug(), saved.getDisplayName());
        return TenantResponse.from(saved);
    }

    @Transactional
    public TenantResponse update(String slug, UpdateTenantRequest req) {
        Tenant t = repo.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Tenant", slug));
        if (req.displayName     != null) t.setDisplayName(req.displayName);
        if (req.legalName       != null) t.setLegalName(req.legalName);
        if (req.taxCode         != null) t.setTaxCode(req.taxCode);
        if (req.plan            != null) t.setPlan(req.plan);
        if (req.defaultLocale   != null) t.setDefaultLocale(req.defaultLocale);
        if (req.defaultCurrency != null) t.setDefaultCurrency(req.defaultCurrency);
        if (req.defaultTimezone!= null) t.setDefaultTimezone(req.defaultTimezone);
        if (req.contactEmail    != null) t.setContactEmail(req.contactEmail);
        if (req.contactPhone    != null) t.setContactPhone(req.contactPhone);
        if (req.loginFlowAlias  != null) t.setLoginFlowAlias(req.loginFlowAlias);
        if (req.roleTemplateId  != null) t.setRoleTemplateId(req.roleTemplateId);
        if (req.metadata       != null) t.setMetadata(req.metadata);
        return TenantResponse.from(repo.save(t));
    }

    @Transactional
    public TenantResponse activate(String slug) {
        Tenant t = repo.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Tenant", slug));
        t.setStatus("active");
        t.setActivatedAt(Instant.now());
        Tenant saved = repo.save(t);
        eventPublisher.publishActivated(saved.getSlug());
        return TenantResponse.from(saved);
    }

    @Transactional
    public TenantResponse suspend(String slug) {
        Tenant t = repo.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Tenant", slug));
        t.setStatus("suspended");
        t.setSuspendedAt(Instant.now());
        return TenantResponse.from(repo.save(t));
    }

    @Transactional
    public TenantResponse offboard(String slug) {
        Tenant t = repo.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Tenant", slug));
        t.setStatus("offboarded");
        t.setOffboardedAt(Instant.now());
        return TenantResponse.from(repo.save(t));
    }

    /** Ghi nhận callback từ tenant-manager sau khi init-schema xong. */
    @Transactional
    public TenantResponse onTenantInitialized(String slug, TenantInitializedCallback cb) {
        Tenant t = repo.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Tenant", slug));
        t.setStatus("active");
        t.setActivatedAt(Instant.now());

        // Ghi tenant_root_org mapping
        TenantRootOrg rootOrg = new TenantRootOrg(cb.getRootOrgCode(), slug, cb.getHrmRootOrgId());
        rootOrg.setHrmEmployeeId(cb.getSuperAdminUserId());
        rootOrgRepo.save(rootOrg);

        Tenant saved = repo.save(t);
        eventPublisher.publishActivated(saved.getSlug());
        return TenantResponse.from(saved);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) throw new NotFoundException("Tenant", id.toString());
        repo.deleteById(id);
    }
}
