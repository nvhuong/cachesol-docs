package com.cachesol.platform.registry.client;

import com.cachesol.platform.registry.dto.InitTenantSchemaRequestDto;
import com.cachesol.platform.registry.dto.InitTenantSchemaResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

/**
 * Service-to-service client gọi tenant-manager để init per-tenant schema
 * (clone role templates, tạo root org, tạo super-admin user).
 *
 * <p>Caller: platform-registry sau khi tenant được persist + IAM realm provisioned.
 * Nếu lỗi → log warn + ném exception để {@link com.cachesol.platform.registry.service.TenantProvisioningRetryJob}
 * retry ở lần chạy sau.
 */
@Slf4j
@Component
public class TenantManagerClient {

    private final RestClient restClient;
    private final String baseUrl;

    public TenantManagerClient(@Value("${tenant-manager.url:http://tenant-manager-service:8083}") String baseUrl) {
        this.baseUrl = baseUrl;
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    /**
     * Trigger init schema cho 1 tenant. Idempotent về phía tenant-manager
     * (re-clone sẽ dùng DB constraints để skip duplicates nếu đã init).
     */
    public InitTenantSchemaResponseDto initTenantSchema(InitTenantSchemaRequestDto req) {
        try {
            return restClient.post()
                    .uri("/service-api/v1/internal/init-schema")
                    .header("Content-Type", "application/json")
                    .body(req)
                    .retrieve()
                    .body(InitTenantSchemaResponseDto.class);
        } catch (HttpClientErrorException ex) {
            log.warn("TenantManager init-schema failed [{}]: {}",
                    ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new TenantManagerCallException("initTenantSchema",
                    ex.getStatusCode().value(),
                    ex.getResponseBodyAsString(), ex);
        } catch (Exception e) {
            log.warn("TenantManager unreachable: {}", e.getMessage());
            throw new TenantManagerCallException("initTenantSchema", 502, e.getMessage(), e);
        }
    }

    public String getBaseUrl() { return baseUrl; }

    public static class TenantManagerCallException extends RuntimeException {
        private final int status;
        private final String operation;
        public TenantManagerCallException(String op, int status, String msg, Throwable cause) {
            super("TenantManager." + op + " failed [" + status + "]: " + msg, cause);
            this.operation = op;
            this.status = status;
        }
        public int getStatus() { return status; }
        public String getOperation() { return operation; }
    }
}
