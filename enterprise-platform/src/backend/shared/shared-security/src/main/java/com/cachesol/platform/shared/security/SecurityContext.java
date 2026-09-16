package com.cachesol.platform.shared.security;

import org.slf4j.MDC;

/**
 * SecurityContext — Lấy user/tenant hiện tại. Production cần đọc từ Spring SecurityContextHolder.
 */
public final class SecurityContext {
    private SecurityContext() {}

    public static String getCurrentUserId() {
        return MDC.get("user_id");
    }

    public static String getCurrentTenantId() {
        return MDC.get("tenant_id");
    }

    public static boolean isAuthenticated() {
        return getCurrentUserId() != null && !getCurrentUserId().isBlank();
    }
}
