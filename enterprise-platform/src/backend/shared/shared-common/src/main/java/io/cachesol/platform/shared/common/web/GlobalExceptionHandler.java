package io.cachesol.platform.shared.common.web;

import io.cachesol.platform.shared.common.api.ApiResponse;
import io.cachesol.platform.shared.common.exception.PlatformException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Global exception handler — chuyển mọi exception thành {@link ApiResponse} chuẩn.
 * Mọi service chỉ cần {@code @RestControllerAdvice} này (đã được auto-config qua shared-common).
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PlatformException.class)
    public ResponseEntity<ApiResponse<Void>> handle(PlatformException ex) {
        HttpStatus status = switch (ex.getCode()) {
            case "NOT_FOUND"        -> HttpStatus.NOT_FOUND;
            case "VALIDATION"       -> HttpStatus.BAD_REQUEST;
            case "FORBIDDEN"        -> HttpStatus.FORBIDDEN;
            case "CONFLICT"         -> HttpStatus.CONFLICT;
            default                 -> HttpStatus.INTERNAL_SERVER_ERROR;
        };
        return ResponseEntity.status(status).body(ApiResponse.fail(ex.getCode(), ex.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handle(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ApiResponse.fail("VALIDATION", ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handle(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.fail("INTERNAL_ERROR", ex.getMessage()));
    }
}
