package com.cachesol.platform.shared.common.tenant;

/**
 * Thread-local tenant context — đọc từ JWT claim {@code tenant} hoặc HTTP header {@code X-Tenant-Slug}.
 * Filter ở mỗi service bind, repository/service đọc để switch schema hoặc filter.
 */
public final class TenantContext {
    private static final ThreadLocal<String> CURRENT = new ThreadLocal<>();

    private TenantContext() {}

    public static void set(String tenantSlug) { CURRENT.set(tenantSlug); }
    public static String get() { return CURRENT.get(); }
    public static void clear() { CURRENT.remove(); }

    public static boolean isSet() { return CURRENT.get() != null; }
}
