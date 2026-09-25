package com.cachesol.platform.registry.dto;

import java.util.List;

/**
 * Response wrapper cho {@code GET /public-api/v1/public/mini-apps}.
 * Khớp với {@code MiniAppCatalogResponse} của frontend.
 */
public record PublicCatalogResponse(
        int total,
        List<PublicMiniAppResponse> items
) {}
