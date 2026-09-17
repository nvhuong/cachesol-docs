package com.cachesol.platform.shared.common.exception;

/**
 * Khi resource đã tồn tại (unique constraint, duplicate key).
 */
public class ConflictException extends PlatformException {
    public ConflictException(String code, String message) {
        super(code, message);
    }
}
