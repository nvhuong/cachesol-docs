package com.cachesol.platform.shared.common.api;

import java.time.Instant;
import java.util.List;

/**
 * Standard wrapper cho mọi API response.
 * Format:
 * <pre>
 * {
 *   "success": true,
 *   "data": ...,
 *   "error": null,
 *   "meta": { "correlationId": "..." }
 * }
 * </pre>
 */
public record ApiResponse<T>(
        boolean success,
        T data,
        ErrorDetail error,
        Meta meta
) {
    public record ErrorDetail(String code, String message, List<String> details) {}
    public record Meta(String correlationId, Instant timestamp) {}

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, new Meta(null, Instant.now()));
    }

    public static <T> ApiResponse<T> ok(T data, String correlationId) {
        return new ApiResponse<>(true, data, null, new Meta(correlationId, Instant.now()));
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        return new ApiResponse<>(false, null, new ErrorDetail(code, message, List.of()), new Meta(null, Instant.now()));
    }
}
