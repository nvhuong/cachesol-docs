package com.cachesol.platform.registry.client;

import com.cachesol.platform.registry.dto.ProvisionRealmRequestDto;
import com.cachesol.platform.registry.dto.ProvisionRealmResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpClientErrorException;

/**
 * Service-to-service client gọi IAM service để provision / xoá realm.
 * Caller: platform-registry khi tenant lifecycle changes.
 */
@Slf4j
@Component
public class IamClient {

    private final RestClient restClient;
    private final String baseUrl;

    public IamClient(@Value("${iam.url:http://iam-service:8082}") String baseUrl) {
        this.baseUrl = baseUrl;
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    /**
     * Provision một realm trong Keycloak (idempotent).
     * Nếu IAM trả về lỗi (network, timeout...) → log warn và KHÔNG fail tenant creation
     * vì tenant đã được ghi vào DB. Background job sẽ retry.
     */
    public ProvisionRealmResponseDto provisionRealm(ProvisionRealmRequestDto req) {
        try {
            return restClient.post()
                    .uri("/service-api/v1/realms/provision")
                    .header("Content-Type", "application/json")
                    .body(req)
                    .retrieve()
                    .body(ProvisionRealmResponseDto.class);
        } catch (HttpClientErrorException ex) {
            log.warn("IAM provisionRealm failed [{}]: {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new IamCallException("provisionRealm", ex.getStatusCode().value(),
                    ex.getResponseBodyAsString(), ex);
        } catch (Exception e) {
            log.warn("IAM provisionRealm unreachable: {}", e.getMessage());
            throw new IamCallException("provisionRealm", 502, e.getMessage(), e);
        }
    }

    public void deleteRealm(String realmName) {
        try {
            restClient.delete()
                    .uri("/service-api/v1/realms/{name}", realmName)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode().value() == 404) return;
            log.warn("IAM deleteRealm failed: {}", ex.getResponseBodyAsString());
        } catch (Exception e) {
            log.warn("IAM deleteRealm unreachable: {}", e.getMessage());
        }
    }

    public String getBaseUrl() { return baseUrl; }

    public static class IamCallException extends RuntimeException {
        private final int status;
        private final String operation;
        public IamCallException(String op, int status, String msg, Throwable cause) {
            super("IAM." + op + " failed [" + status + "]: " + msg, cause);
            this.operation = op;
            this.status = status;
        }
        public int getStatus() { return status; }
        public String getOperation() { return operation; }
    }
}
