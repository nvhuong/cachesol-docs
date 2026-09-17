package com.cachesol.platform.registry.service;

import com.cachesol.platform.registry.dto.PermissionTemplateResponse;
import com.cachesol.platform.registry.entity.PermissionTemplate;
import com.cachesol.platform.registry.repository.PermissionTemplateRepository;
import com.cachesol.platform.shared.common.exception.ConflictException;
import com.cachesol.platform.shared.common.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionTemplateService {

    private final PermissionTemplateRepository repo;

    public List<PermissionTemplateResponse> list() {
        return repo.findAll().stream()
                .map(PermissionTemplateResponse::from)
                .toList();
    }

    @Transactional
    public PermissionTemplateResponse create(String code, String description, String category) {
        if (repo.findByCode(code).isPresent()) {
            throw new ConflictException("PERM_ALREADY_EXISTS", "Permission template đã tồn tại: " + code);
        }
        PermissionTemplate p = new PermissionTemplate(code, description, category);
        return PermissionTemplateResponse.from(repo.save(p));
    }

    public PermissionTemplateResponse get(java.util.UUID id) {
        return PermissionTemplateResponse.from(repo.findById(id)
                .orElseThrow(() -> new NotFoundException("PermissionTemplate", id.toString())));
    }
}
