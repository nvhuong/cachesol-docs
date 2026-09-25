package com.cachesol.platform.registry.exception;

import com.cachesol.platform.shared.common.exception.PlatformException;

/**
 * 404 cho public catalog khi không tìm thấy mini-app theo code.
 * Extends PlatformException → {@code GlobalExceptionHandler} sẽ trả 404 + ApiResponse.fail.
 */
public class NotFoundAppException extends PlatformException {
    public NotFoundAppException(String code) {
        super("NOT_FOUND", "Mini-app không tồn tại hoặc đã bị gỡ: " + code);
    }
}
