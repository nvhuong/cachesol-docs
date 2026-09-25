package com.cachesol.platform.registry.config;

import com.cachesol.platform.shared.common.api.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Validation handlers riêng cho platform-registry — giữ format {@link ApiResponse}
 * chuẩn khi Bean Validation fail hoặc JSON malformed.
 *
 * <p>Global handler trong shared-common chỉ cover PlatformException / IllegalArgumentException /
 * generic Exception — không catch lỗi từ {@code @Valid}.
 */
@RestControllerAdvice
public class RegistryValidationHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handle(MethodArgumentNotValidException ex) {
        List<String> details = ex.getBindingResult().getAllErrors().stream()
                .map(err -> {
                    if (err instanceof org.springframework.validation.FieldError fe) {
                        return fe.getField() + ": " + fe.getDefaultMessage();
                    }
                    return err.getDefaultMessage();
                })
                .collect(Collectors.toList());

        String firstMsg = details.isEmpty() ? "Payload không hợp lệ" : details.get(0);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ApiResponse<>(
                        false, null,
                        new ApiResponse.ErrorDetail("VALIDATION", firstMsg, details),
                        new ApiResponse.Meta(null, java.time.Instant.now())));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handle(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.fail("VALIDATION", "JSON payload không đọc được: " + ex.getMostSpecificCause().getMessage()));
    }
}
