package com.cachesol.platform.registry.dto;

import com.cachesol.platform.registry.entity.MiniApp;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Public-facing catalog entry cho Landing page.
 *
 * <p>Khác {@link MiniAppResponse} ở chỗ:
 * <ul>
 *   <li>{@code id} là {@code code} (string) để URL ngắn gọn (/apps/hrm thay vì UUID)</li>
 *   <li>Có {@code tagline}, {@code features[]}, {@code pricing}, {@code currency},
 *       {@code pricePerMonth}, {@code minSeats}, {@code publisherName}, {@code publishedAt}
 *       — các trường marketing được lưu trong {@code metadata} JSONB.</li>
 *   <li>Không leak registry-internal fields (version, isCore, isActive, createdAt, updatedAt).</li>
 * </ul>
 *
 * <p>Catalog marketing data (tagline, features, pricing, ...) được lưu trong cột
 * {@code mini_apps.metadata} (JSONB) thay vì tách bảng — tiết kiệm join, dễ evolve,
 * và chỉ backend biết schema.
 */
public record PublicMiniAppResponse(
        String id,
        String name,
        String tagline,
        String description,
        String category,
        String pricing,           // 'free' | 'per-user' | 'flat-rate' | 'custom'
        Integer minSeats,
        String currency,
        BigDecimal pricePerMonth,
        List<String> features,
        String publisherName,
        String publishedAt,       // ISO date (yyyy-MM-dd)
        String installEndpoint,
        String iconUrl
) {
    @SuppressWarnings("unchecked")
    public static PublicMiniAppResponse from(MiniApp m) {
        Map<String, Object> meta = m.getMetadata() == null ? Map.of() : m.getMetadata();

        return new PublicMiniAppResponse(
                m.getCode(),
                m.getName(),
                str(meta, "tagline", m.getName()),
                str(meta, "description", m.getDescription()),
                normalizeCategory(str(meta, "category", m.getCategory())),
                str(meta, "pricing", "per-user"),
                intOrNull(meta.get("minSeats")),
                str(meta, "currency", "VND"),
                m.getBasePrice() != null ? m.getBasePrice() : decimal(meta.get("pricePerMonth")),
                listOfStrings(meta.get("features")),
                str(meta, "publisherName", "CacheSol"),
                publishedAt(m.getCreatedAt(), meta.get("publishedAt")),
                str(meta, "installEndpoint", null),
                m.getIconUrl()
        );
    }

    /** Frontend dùng category chữ thường: hr / sales / finance / operations / analytics / productivity. */
    private static String normalizeCategory(String cat) {
        if (cat == null) return "productivity";
        return switch (cat.toUpperCase()) {
            case "HRM" -> "hr";
            case "SALES" -> "sales";
            case "FINANCE" -> "finance";
            case "OPERATIONS" -> "operations";
            case "ANALYTICS" -> "analytics";
            default -> cat.toLowerCase();
        };
    }

    private static String str(Map<String, Object> meta, String key, String fallback) {
        Object v = meta.get(key);
        if (v == null) return fallback;
        return v.toString();
    }

    private static Integer intOrNull(Object v) {
        if (v == null) return null;
        if (v instanceof Number n) return n.intValue();
        try { return Integer.parseInt(v.toString()); } catch (NumberFormatException e) { return null; }
    }

    private static BigDecimal decimal(Object v) {
        if (v == null) return null;
        if (v instanceof BigDecimal bd) return bd;
        if (v instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        try { return new BigDecimal(v.toString()); } catch (NumberFormatException e) { return null; }
    }

    @SuppressWarnings("unchecked")
    private static List<String> listOfStrings(Object v) {
        if (v == null) return List.of();
        if (v instanceof List<?> list) {
            List<String> out = new ArrayList<>(list.size());
            for (Object item : list) {
                if (item != null) out.add(item.toString());
            }
            return out;
        }
        return List.of();
    }

    /** Resolve publishedAt: prefer metadata.publishedAt (yyyy-MM-dd), fallback createdAt. */
    private static String publishedAt(Instant createdAt, Object metaValue) {
        if (metaValue instanceof String s && !s.isBlank()) {
            // Validate format
            try {
                LocalDate.parse(s);
                return s;
            } catch (DateTimeParseException ignored) {
                // fall through
            }
        }
        return createdAt != null ? createdAt.toString().substring(0, 10) : null;
    }
}
