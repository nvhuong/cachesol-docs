package com.cachesol.platform.registry.service;

import com.cachesol.platform.registry.dto.PublicRegistrationRequest;
import com.cachesol.platform.registry.dto.PublicRegistrationResponse;
import com.cachesol.platform.registry.client.IamClient;
import com.cachesol.platform.registry.entity.Tenant;
import com.cachesol.platform.registry.event.TenantEventPublisher;
import com.cachesol.platform.registry.exception.RegistrationValidationException;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Service xử lý public tenant registration — không cần auth, được gọi từ landing page.
 *
 * <p>Flow:
 * <ol>
 *   <li>Validate consents + country (sync, fail-fast)</li>
 *   <li>Persist tenant qua {@link PublicTenantPersister} (transactional)</li>
 *   <li>Sau commit → fire-and-forget IAM provision + Kafka publish (async)</li>
 *   <li>Trả response ngay cho client — không đợi IAM/Kafka</li>
 * </ol>
 *
 * <p>Quan trọng: IAM provision + Kafka publish chạy <b>ngoài</b> transaction path
 * (qua daemon executor). Nếu Kafka hoặc Keycloak chậm/timeout, request vẫn return
 * nhanh với tenant đã được persist. Background job sẽ retry khi cần.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PublicRegistrationService {

    /** Country → TLD mặc định cho admin subdomain. */
    private static final Map<String, String> COUNTRY_TO_TLD = Map.of(
            "VN", "vn",
            "SG", "sg",
            "US", "us",
            "JP", "jp",
            "KR", "kr"
    );

    private final PublicTenantPersister persister;
    private final TenantEventPublisher eventPublisher;
    private final IamClient iamClient;

    /** Single-thread daemon executor cho fire-and-forget post-commit work. */
    private ExecutorService asyncExecutor;

    @PostConstruct
    void init() {
        this.asyncExecutor = Executors.newSingleThreadExecutor(r -> {
            Thread t = new Thread(r, "public-registration-post-commit");
            t.setDaemon(true);
            return t;
        });
    }

    @PreDestroy
    void shutdown() {
        if (asyncExecutor != null) {
            asyncExecutor.shutdownNow();
        }
    }

    /** Public entry: tạo tenant, return ngay. IAM + Kafka chạy async sau commit. */
    public PublicRegistrationResponse register(PublicRegistrationRequest req) {
        validateRequest(req);

        // Persist trong transaction riêng (proxy qua bean khác).
        Tenant saved = persister.persist(req);

        // Schedule post-commit work (IAM provision + Kafka publish).
        schedulePostCommitWork(saved);

        return buildResponse(req, saved);
    }

    private void validateRequest(PublicRegistrationRequest req) {
        if (req.consents == null
                || !req.consents.termsAccepted
                || !req.consents.privacyAccepted) {
            throw new RegistrationValidationException(
                    "CONSENT_REQUIRED",
                    "Bạn cần đồng ý Điều khoản sử dụng và Chính sách bảo mật."
            );
        }
        if (req.company == null || req.company.country == null) {
            throw new RegistrationValidationException(
                    "MISSING_COUNTRY",
                    "Thiếu quốc gia của công ty."
            );
        }
    }

    /**
     * Đăng ký post-commit hook để fire IAM + Kafka async SAU khi transaction commit.
     * Nếu đang test ngoài transaction, submit thẳng vào executor.
     */
    private void schedulePostCommitWork(Tenant saved) {
        Runnable work = () -> {
            try {
                iamClient.provisionRealm(com.cachesol.platform.registry.dto.ProvisionRealmRequestDto.forTenant(
                        saved.getKeycloakRealm(),
                        saved.getDisplayName(),
                        saved.getSlug(),
                        List.of("TENANT_ADMIN", "COMPANY_ADMIN", "HRM_USER")
                ));
                log.info("Keycloak realm '{}' provisioned for tenant '{}'",
                        saved.getKeycloakRealm(), saved.getSlug());
            } catch (Exception e) {
                log.warn("Keycloak provision failed for '{}': {}. Will retry async.",
                        saved.getSlug(), e.getMessage());
            }
            try {
                eventPublisher.publishCreated(saved.getSlug(), saved.getDisplayName());
            } catch (Exception e) {
                log.warn("Publish TenantCreatedEvent failed for '{}': {}",
                        saved.getSlug(), e.getMessage());
            }
        };

        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    asyncExecutor.submit(work);
                }
            });
        } else {
            asyncExecutor.submit(work);
        }
    }

    private PublicRegistrationResponse buildResponse(PublicRegistrationRequest req, Tenant saved) {
        String tld = COUNTRY_TO_TLD.getOrDefault(req.company.country, "com");
        String adminUrl = "https://%s.%s.cachesol.io/admin".formatted(saved.getSlug(), tld);
        return new PublicRegistrationResponse(
                saved.getId().toString(),
                saved.getSlug(),
                adminUrl,
                saved.getContactEmail(),
                "5-10 phút"
        );
    }
}
