package com.cachesol.platform.registry.exception;

import com.cachesol.platform.shared.common.exception.PlatformException;

public class TenantAlreadyExistsException extends PlatformException {
    public TenantAlreadyExistsException(String slug) {
        super("TENANT_ALREADY_EXISTS", "Tenant đã tồn tại: " + slug);
    }
}
