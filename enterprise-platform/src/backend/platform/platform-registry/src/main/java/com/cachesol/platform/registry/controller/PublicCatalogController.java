package com.cachesol.platform.registry.controller;

import com.cachesol.platform.registry.dto.PublicCatalogResponse;
import com.cachesol.platform.registry.dto.PublicMiniAppResponse;
import com.cachesol.platform.registry.exception.NotFoundAppException;
import com.cachesol.platform.registry.repository.MiniAppRepository;
import com.cachesol.platform.shared.common.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public catalog endpoints — landing page (no authentication required).
 *
 * <p>Endpoints:
 * <ul>
 *   <li>{@code GET /public-api/v1/public/mini-apps} — list all active mini-apps</li>
 *   <li>{@code GET /public-api/v1/public/mini-apps/{code}} — detail by code (e.g. "hrm")</li>
 * </ul>
 *
 * <p>Backend: ở Platform Registry; mapping từ {@code MiniApp} entity sang
 * {@link PublicMiniAppResponse} (catalog DTO, không leak registry internals).
 */
@RestController
@RequestMapping("/public-api/v1/public")
@RequiredArgsConstructor
public class PublicCatalogController {

    private final MiniAppRepository repo;

    @GetMapping("/mini-apps")
    public ApiResponse<PublicCatalogResponse> list() {
        var items = repo.findByActiveTrueOrderByCodeAsc().stream()
                .map(PublicMiniAppResponse::from)
                .toList();
        return ApiResponse.ok(new PublicCatalogResponse(items.size(), items));
    }

    @GetMapping("/mini-apps/{code}")
    public ApiResponse<PublicMiniAppResponse> getByCode(@PathVariable String code) {
        var m = repo.findByCodeAndActiveTrue(code)
                .orElseThrow(() -> new NotFoundAppException(code));
        return ApiResponse.ok(PublicMiniAppResponse.from(m));
    }
}
