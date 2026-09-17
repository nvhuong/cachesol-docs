package com.cachesol.platform.tenant.client;

import com.cachesol.platform.tenant.dto.PermissionResponse;
import com.cachesol.platform.tenant.dto.RoleTemplateSnapshotResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * HTTP client gọi platform-registry service-api để clone role templates.
 */
@Slf4j
@Component
public class PlatformRegistryClient {

    private final RestClient restClient;

    public PlatformRegistryClient(
            @Value("${platform-registry.url:http://platform-registry-service:8081}") String baseUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public List<PermissionResponse> getPermissionTemplates() {
        try {
            PermissionResponse[] arr = restClient.get()
                    .uri("/service-api/v1/permissions/templates")
                    .retrieve()
                    .body(PermissionResponse[].class);
            return List.of(arr != null ? arr : new PermissionResponse[0]);
        } catch (Exception e) {
            log.warn("Không lấy được permission templates từ platform-registry: {}", e.getMessage());
            return List.of();
        }
    }

    public List<RoleTemplateSnapshotResponse> getRoleTemplates() {
        try {
            RoleTemplateSnapshotResponse[] arr = restClient.get()
                    .uri("/service-api/v1/roles/templates")
                    .retrieve()
                    .body(RoleTemplateSnapshotResponse[].class);
            return List.of(arr != null ? arr : new RoleTemplateSnapshotResponse[0]);
        } catch (Exception e) {
            log.warn("Không lấy được role templates từ platform-registry: {}", e.getMessage());
            return List.of();
        }
    }
}
