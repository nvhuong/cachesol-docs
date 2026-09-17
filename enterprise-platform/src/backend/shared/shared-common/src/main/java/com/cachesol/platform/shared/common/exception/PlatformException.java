package com.cachesol.platform.shared.common.exception;

/**
 * Base exception cho mọi service trong platform.
 * Throw → sẽ được {@code GlobalExceptionHandler} catch → trả {@link com.cachesol.platform.shared.common.api.ApiResponse} với success=false.
 */
public class PlatformException extends RuntimeException {
    private final String code;

    public PlatformException(String code, String message) {
        super(message);
        this.code = code;
    }

    public PlatformException(String code, String message, Throwable cause) {
        super(message, cause);
        this.code = code;
    }

    public String getCode() {
        return code;
    }
}
