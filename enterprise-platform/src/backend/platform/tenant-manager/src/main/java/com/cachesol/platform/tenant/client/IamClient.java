package com.cachesol.platform.tenant.client;

import com.cachesol.platform.tenant.dto.CreateKeycloakUserFromTenantRequest;
import com.cachesol.platform.tenant.dto.KeycloakUserSummary;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Service-to-service client gọi IAM service để CRUD user trong Keycloak realm.
 * Caller: tenant-manager khi CRUD AppUser (link 1-1 với Keycloak user).
 *
 * Lưu ý: IAM base URL ở đây dùng internal DNS name {@code iam-service}.
 * Convention: realm của tenant = "tenant-<slug>" → truyền qua header X-Realm.
 */
@Slf4j
@Component
public class IamClient {

    private final RestClient restClient;

    public IamClient(@Value("${iam.url:http://iam-service:8082}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    /** Convention: realm name = "tenant-<slug>". */
    public static String realmOfTenant(String tenantSlug) {
        return "tenant-" + tenantSlug;
    }

    /** Tạo user trong Keycloak realm, trả về Keycloak user id (UUID). */
    public String createUser(String realm, CreateKeycloakUserFromTenantRequest req) {
        try {
            Map<String, Object> resp = restClient.post()
                    .uri("/service-api/v1/users")
                    .header("X-Realm", realm)
                    .header("Content-Type", "application/json")
                    .body(req)
                    .retrieve()
                    .body(Map.class);
            if (resp == null || resp.get("data") == null) {
                log.warn("IAM createUser returned empty body realm={} u={}", realm, req.username());
                return null;
            }
            Object data = resp.get("data");
            if (data instanceof Map<?, ?> map) {
                Object id = map.get("id");
                return id == null ? null : id.toString();
            }
            return null;
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatusCode.valueOf(409)) {
                // Conflict = user exists, lookup id
                log.info("User exists in Keycloak realm={} u={}, fetching id", realm, req.username());
                return findUserId(realm, req.username());
            }
            log.warn("IAM createUser failed realm={} u={}: {}", realm, req.username(), ex.getMessage());
            throw new IamCallException("createUser", ex.getStatusCode().value(),
                    ex.getResponseBodyAsString(), ex);
        } catch (Exception e) {
            log.warn("IAM createUser unreachable: {}", e.getMessage());
            throw new IamCallException("createUser", 502, e.getMessage(), e);
        }
    }

    public void deleteUser(String realm, String keycloakUserId) {
        try {
            restClient.delete()
                    .uri("/service-api/v1/users/{id}", keycloakUserId)
                    .header("X-Realm", realm)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode().value() == 404) return;
            log.warn("IAM deleteUser failed: {}", ex.getMessage());
        } catch (Exception e) {
            log.warn("IAM deleteUser unreachable: {}", e.getMessage());
        }
    }

    public void resetPassword(String realm, String keycloakUserId, String newPassword, boolean temporary) {
        try {
            restClient.put()
                    .uri("/service-api/v1/users/{id}/password", keycloakUserId)
                    .header("X-Realm", realm)
                    .header("Content-Type", "application/json")
                    .body(Map.of("password", newPassword, "temporary", temporary))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.warn("IAM resetPassword failed: {}", e.getMessage());
        }
    }

    public void assignRealmRole(String realm, String keycloakUserId, String roleName) {
        try {
            restClient.post()
                    .uri("/service-api/v1/users/{id}/roles", keycloakUserId)
                    .header("X-Realm", realm)
                    .header("Content-Type", "application/json")
                    .body(Map.of("realmRoles", java.util.List.of(roleName)))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.warn("IAM assignRealmRole failed: {}", e.getMessage());
        }
    }

    public void revokeRealmRole(String realm, String keycloakUserId, String roleName) {
        try {
            restClient.delete()
                    .uri("/service-api/v1/users/{id}/roles/{role}", keycloakUserId, roleName)
                    .header("X-Realm", realm)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.warn("IAM revokeRealmRole failed: {}", e.getMessage());
        }
    }

    /** Lookup Keycloak user id by username; null nếu không tồn tại. */
    public String findUserId(String realm, String username) {
        try {
            Map<String, Object> resp = restClient.get()
                    .uri("/service-api/v1/users/by-username/{u}", username)
                    .header("X-Realm", realm)
                    .retrieve()
                    .body(Map.class);
            if (resp == null || resp.get("data") == null) return null;
            Object data = resp.get("data");
            if (data instanceof Map<?, ?> map) {
                Object id = map.get("id");
                return id == null ? null : id.toString();
            }
            return null;
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode().value() == 404) return null;
            log.warn("IAM findUserId failed: {}", ex.getMessage());
            return null;
        } catch (Exception e) {
            log.warn("IAM findUserId unreachable: {}", e.getMessage());
            return null;
        }
    }

    public KeycloakUserSummary fetchUser(String realm, String keycloakUserId) {
        try {
            Map<String, Object> resp = restClient.get()
                    .uri("/service-api/v1/users/{id}", keycloakUserId)
                    .header("X-Realm", realm)
                    .retrieve()
                    .body(Map.class);
            if (resp == null || resp.get("data") == null) return null;
            Object data = resp.get("data");
            if (data instanceof Map<?, ?> map) {
                return new KeycloakUserSummary(
                        str(map.get("id")),
                        str(map.get("username")),
                        str(map.get("email")),
                        Boolean.TRUE.equals(map.get("enabled"))
                );
            }
            return null;
        } catch (Exception e) {
            log.warn("IAM fetchUser failed: {}", e.getMessage());
            return null;
        }
    }

    private static String str(Object o) { return o == null ? null : o.toString(); }

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
