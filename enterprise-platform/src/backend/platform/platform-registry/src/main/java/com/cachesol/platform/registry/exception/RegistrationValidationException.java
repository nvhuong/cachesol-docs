package com.cachesol.platform.registry.exception;

import com.cachesol.platform.shared.common.exception.PlatformException;

/**
 * 400 cho public registration khi payload invalid.
 * Extends PlatformException → {@code GlobalExceptionHandler} sẽ trả 400 + ApiResponse.fail.
 */
public class RegistrationValidationException extends PlatformException {
    public RegistrationValidationException(String code, String message) {
        super(code, message);
    }
}
