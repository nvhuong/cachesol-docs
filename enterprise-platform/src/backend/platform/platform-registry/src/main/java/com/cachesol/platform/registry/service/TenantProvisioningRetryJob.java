package com.cachesol.platform.registry.service;

import com.cachesol.platform.registry.client.IamClient;
import com.cachesol.platform.registry.dto.ProvisionRealmRequestDto;
import com.cachesol.platform.registry.entity.Tenant;
import com.cachesol.platform.registry.event.TenantEventPublisher;
import com.cachesol.platform.registry.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * Background job retry post-commit work (IAM provision + Kafka publish)
 * cho tenants stuck ở trạng thái `provisioning`.
 *
 * <p>Lý do cần job này: {@link PublicRegistrationService#schedulePostCommitWork}
 * chạy fire-and-forget sau transaction commit. Nếu IAM hoặc Kafka tạm thời
 * không khả dụng, post-commit sẽ log warn + nuốt lỗi. Job này quét lại những
 * tenant chưa flip sang `active` sau N giây và retry.
 *
 * <p>Idempotency: IAM provision là idempotent (gọi lại cùng realm → no-op).
 * Kafka publish ghi lại event mỗi lần retry (consumer cần tự dedupe theo tenantId).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TenantProvisioningRetryJob {

    private final TenantRepository tenantRepository;
    private final IamClient iamClient;
    private final TenantEventPublisher eventPublisher;

    /** Retry tenants older than this many seconds. */
    @Value("${cachesol.registry.provisioning.retry-after-seconds:30}")
    private int retryAfterSeconds;

    /** Run every 15 seconds. */
    @Scheduled(fixedDelayString = "${cachesol.registry.provisioning.retry-interval-ms:15000}")
    @Transactional(readOnly = true)
    public void retryStuckProvisionings() {
        Instant cutoff = Instant.now().minusSeconds(retryAfterSeconds);
        List<Tenant> stuck = tenantRepository.findAll().stream()
                .filter(t -> "provisioning".equalsIgnoreCase(t.getStatus()))
                .filter(t -> t.getCreatedAt() != null && t.getCreatedAt().isBefore(cutoff))
                .toList();

        if (stuck.isEmpty()) {
            return;
        }

        log.info("Retrying post-commit work for {} stuck provisioning tenant(s)", stuck.size());
        for (Tenant tenant : stuck) {
            tryProvision(tenant);
            tryPublish(tenant);
        }
    }

    private void tryProvision(Tenant tenant) {
        try {
            iamClient.provisionRealm(ProvisionRealmRequestDto.forTenant(
                    tenant.getKeycloakRealm(),
                    tenant.getDisplayName(),
                    tenant.getSlug(),
                    List.of("TENANT_ADMIN", "COMPANY_ADMIN", "HRM_USER")
            ));
            log.info("Retry succeeded: Keycloak realm '{}' provisioned for tenant '{}'",
                    tenant.getKeycloakRealm(), tenant.getSlug());
        } catch (Exception e) {
            log.warn("Retry failed: Keycloak provision for tenant '{}': {}",
                    tenant.getSlug(), e.getMessage());
        }
    }

    private void tryPublish(Tenant tenant) {
        try {
            eventPublisher.publishCreated(tenant.getSlug(), tenant.getDisplayName());
            log.info("Retry succeeded: published TenantCreatedEvent for tenant '{}'",
                    tenant.getSlug());
        } catch (Exception e) {
            log.warn("Retry failed: publish TenantCreatedEvent for tenant '{}': {}",
                    tenant.getSlug(), e.getMessage());
        }
    }
}
