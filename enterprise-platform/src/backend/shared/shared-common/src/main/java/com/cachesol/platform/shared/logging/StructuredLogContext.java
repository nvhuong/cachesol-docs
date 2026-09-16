package com.cachesol.platform.shared.logging;

import org.slf4j.MDC;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.Callable;

/**
 * StructuredLogContext — Helper set/clear MDC an toàn với try-with-resources.
 *
 * <p>Cách dùng:
 * <pre>{@code
 * try (var ignored = StructuredLogContext.of("orderId", order.getId())) {
 *     // tất cả log trong block này sẽ có MDC "orderId" = ...
 *     log.info("Processing order");
 * }
 * }</pre>
 *
 * <p>Đảm bảo MDC được clear sau khi request kết thúc, tránh leak sang thread pool.
 */
public final class StructuredLogContext {

    private StructuredLogContext() {}

    public static AutoCloseable of(String key, String value) {
        MDC.put(key, value);
        return () -> MDC.remove(key);
    }

    public static AutoCloseable of(Map<String, String> values) {
        Map<String, String> previous = new HashMap<>();
        values.forEach((k, v) -> {
            previous.put(k, MDC.get(k));
            MDC.put(k, v);
        });
        return () -> previous.forEach((k, v) -> {
            if (v == null) MDC.remove(k);
            else MDC.put(k, v);
        });
    }

    public static String newCorrelationId() {
        return UUID.randomUUID().toString();
    }

    public static String get(String key) {
        return MDC.get(key);
    }

    public static <T> T wrap(Callable<T> callable, Map<String, String> ctx) throws Exception {
        try (AutoCloseable ignored = of(ctx)) {
            return callable.call();
        }
    }

    public static void clear() {
        MDC.clear();
    }
}
