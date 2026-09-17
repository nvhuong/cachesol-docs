package com.cachesol.platform.registry.service;

import com.cachesol.platform.registry.dto.CreateMiniAppRequest;
import com.cachesol.platform.registry.dto.MiniAppResponse;
import com.cachesol.platform.registry.entity.MiniApp;
import com.cachesol.platform.registry.event.TenantEventPublisher;
import com.cachesol.platform.registry.repository.MiniAppRepository;
import com.cachesol.platform.shared.common.exception.ConflictException;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MiniAppService {

    private final MiniAppRepository repo;
    private final TenantEventPublisher eventPublisher;

    public List<MiniAppResponse> list() {
        return repo.findAll().stream().map(MiniAppResponse::from).toList();
    }

    public List<MiniAppResponse> listActive() {
        return repo.findByActiveTrue().stream().map(MiniAppResponse::from).toList();
    }

    @Transactional
    public MiniAppResponse register(CreateMiniAppRequest req) {
        if (repo.findByCode(req.code).isPresent()) {
            throw new ConflictException("MINIAPP_EXISTS", "Mini-app đã tồn tại: " + req.code);
        }
        MiniApp m = new MiniApp();
        m.setCode(req.code);
        m.setName(req.name);
        if (req.description   != null) m.setDescription(req.description);
        m.setVersion(req.version != null ? req.version : "0.0.1");
        if (req.category      != null) m.setCategory(req.category);
        if (req.iconUrl       != null) m.setIconUrl(req.iconUrl);
        if (req.documentationUrl != null) m.setDocumentationUrl(req.documentationUrl);
        if (req.basePrice     != null) m.setBasePrice(req.basePrice);
        m.setCore(req.core);
        m.setActive(req.active);
        MiniApp saved = repo.save(m);
        eventPublisher.publishMiniAppRegistered("public", saved.getCode(), saved.getVersion());
        return MiniAppResponse.from(saved);
    }

    public MiniAppResponse get(UUID id) {
        return MiniAppResponse.from(repo.findById(id)
                .orElseThrow(() -> new NotFoundException("MiniApp", id.toString())));
    }

    public MiniAppResponse getByCode(String code) {
        return MiniAppResponse.from(repo.findByCode(code)
                .orElseThrow(() -> new NotFoundException("MiniApp", code)));
    }

    @Transactional
    public MiniAppResponse update(UUID id, CreateMiniAppRequest req) {
        MiniApp m = repo.findById(id)
                .orElseThrow(() -> new NotFoundException("MiniApp", id.toString()));
        if (req.name              != null) m.setName(req.name);
        if (req.description       != null) m.setDescription(req.description);
        if (req.version           != null) m.setVersion(req.version);
        if (req.category          != null) m.setCategory(req.category);
        if (req.iconUrl           != null) m.setIconUrl(req.iconUrl);
        if (req.documentationUrl  != null) m.setDocumentationUrl(req.documentationUrl);
        if (req.basePrice         != null) m.setBasePrice(req.basePrice);
        if (req.core              != m.isCore()) m.setCore(req.core);
        if (req.active            != m.isActive()) m.setActive(req.active);
        return MiniAppResponse.from(repo.save(m));
    }

    @Transactional
    public void delete(UUID id) {
        if (!repo.existsById(id)) throw new NotFoundException("MiniApp", id.toString());
        repo.deleteById(id);
    }
}
