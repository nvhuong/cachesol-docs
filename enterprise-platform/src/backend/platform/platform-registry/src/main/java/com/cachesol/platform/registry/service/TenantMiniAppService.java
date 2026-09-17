package com.cachesol.platform.registry.service;

import com.cachesol.platform.registry.dto.EnableMiniAppRequest;
import com.cachesol.platform.registry.dto.TenantMiniAppResponse;
import com.cachesol.platform.registry.entity.TenantMiniApp;
import com.cachesol.platform.registry.repository.MiniAppRepository;
import com.cachesol.platform.registry.repository.TenantMiniAppRepository;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import com.cachesol.platform.shared.common.exception.ConflictException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TenantMiniAppService {

    private final TenantMiniAppRepository repo;
    private final MiniAppRepository       miniAppRepo;

    public List<TenantMiniAppResponse> listForTenant(String tenantSlug) {
        return repo.findByTenantSlug(tenantSlug).stream()
                .map(TenantMiniAppResponse::from)
                .toList();
    }

    @Transactional
    public TenantMiniAppResponse enable(String tenantSlug, EnableMiniAppRequest req) {
        // Verify mini-app exists in catalog
        if (!miniAppRepo.existsById(req.miniAppId)) {
            throw new NotFoundException("MiniApp", req.miniAppId.toString());
        }
        // Upsert
        TenantMiniApp tma = repo.findByTenantSlugAndMiniAppId(tenantSlug, req.miniAppId)
                .orElseGet(() -> {
                    TenantMiniApp n = new TenantMiniApp(tenantSlug, req.miniAppId, req.enabledBy);
                    n.setEnabled(req.enabled);
                    n.setEnabledAt(Instant.now());
                    if (req.config != null) n.setConfig(req.config);
                    if (req.notes  != null) n.setNotes(req.notes);
                    return n;
                });
        if (req.enabled) {
            tma.setEnabled(true);
            tma.setEnabledAt(Instant.now());
        } else {
            tma.setEnabled(false);
        }
        if (req.config != null) tma.setConfig(req.config);
        if (req.notes  != null) tma.setNotes(req.notes);
        return TenantMiniAppResponse.from(repo.save(tma));
    }

    @Transactional
    public void disable(String tenantSlug, UUID miniAppId) {
        TenantMiniApp tma = repo.findByTenantSlugAndMiniAppId(tenantSlug, miniAppId)
                .orElseThrow(() -> new NotFoundException("TenantMiniApp",
                        tenantSlug + "/" + miniAppId));
        tma.setEnabled(false);
        repo.save(tma);
    }

    @Transactional
    public void delete(String tenantSlug, UUID miniAppId) {
        repo.deleteByTenantSlugAndMiniAppId(tenantSlug, miniAppId);
    }
}
