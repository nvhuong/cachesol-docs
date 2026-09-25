package com.cachesol.platform.registry.service;

import com.cachesol.platform.registry.dto.PublicRegistrationRequest;
import com.cachesol.platform.registry.entity.MiniApp;
import com.cachesol.platform.registry.entity.Tenant;
import com.cachesol.platform.registry.exception.RegistrationValidationException;
import com.cachesol.platform.registry.repository.MiniAppRepository;
import com.cachesol.platform.registry.repository.TenantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Persist tenant từ public registration request — tách riêng để giữ
 * {@code @Transactional} proxy hoạt động (cùng class thì Spring AOP bypass).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class PublicTenantPersister {

    private final TenantRepository tenantRepo;
    private final MiniAppRepository miniAppRepo;

    @Transactional
    public Tenant persist(PublicRegistrationRequest req) {
        String slug = deriveSlug(req.company.companyName);
        if (tenantRepo.existsBySlug(slug)) {
            throw new RegistrationValidationException(
                    "SLUG_TAKEN",
                    "Tên công ty đã được sử dụng. Vui lòng chọn tên khác hoặc liên hệ support@cachesol.io."
            );
        }

        // Resolve selected mini-apps.
        List<String> selectedIds = req.subscription != null && req.subscription.selectedMiniAppIds != null
                ? req.subscription.selectedMiniAppIds
                : List.of();
        List<MiniApp> selectedApps = selectedIds.isEmpty()
                ? List.of()
                : miniAppRepo.findByActiveTrueOrderByCodeAsc().stream()
                        .filter(m -> selectedIds.contains(m.getCode()))
                        .toList();
        Set<String> foundCodes = selectedApps.stream()
                .map(MiniApp::getCode)
                .collect(Collectors.toSet());
        List<String> missing = selectedIds.stream()
                .filter(c -> !foundCodes.contains(c))
                .toList();
        if (!missing.isEmpty()) {
            log.warn("Public registration: missing mini-app codes {}", missing);
        }

        Tenant t = new Tenant();
        t.setSlug(slug);
        t.setSchemaName("tenant_" + slug);
        t.setDisplayName(req.company.companyName);
        t.setTaxCode(req.company.taxCode);
        t.setPlan("trial");
        t.setRegion(req.company.country.toLowerCase(Locale.ROOT));
        t.setKeycloakRealm(slug);
        t.setDefaultLocale("vi");
        t.setDefaultCurrency(req.subscription != null && req.subscription.billingCurrency != null
                ? req.subscription.billingCurrency : "VND");
        t.setDefaultTimezone("Asia/Ho_Chi_Minh");
        t.setContactEmail(req.contact.email);
        t.setContactPhone(req.contact.phone);
        t.setStatus("provisioning");

        Map<String, Object> meta = new HashMap<>();
        meta.put("registeredVia", "landing-page");
        meta.put("registeredAt", Instant.now().toString());
        meta.put("contactName", req.contact.fullName);
        meta.put("contactJobTitle", req.contact.jobTitle);
        if (req.company.companySize != null) meta.put("companySize", req.company.companySize);
        if (req.company.industry != null) meta.put("industry", req.company.industry);
        if (req.company.website != null) meta.put("website", req.company.website);
        if (req.company.province != null) meta.put("province", req.company.province);
        if (req.company.addressLine != null) meta.put("addressLine", req.company.addressLine);
        if (req.referrer != null) meta.put("referrer", req.referrer);
        if (req.consents.marketingOptIn != null) meta.put("marketingOptIn", req.consents.marketingOptIn);
        meta.put("selectedMiniApps", selectedApps.stream().map(MiniApp::getCode).toList());
        meta.put("estimatedSeats", req.subscription != null ? req.subscription.estimatedSeats : 0);
        meta.put("billingCurrency", t.getDefaultCurrency());
        t.setMetadata(meta);

        Tenant saved = tenantRepo.save(t);
        log.info("Public registration created tenant slug={} id={}", saved.getSlug(), saved.getId());
        return saved;
    }

    /** Convert "Công ty TNHH ABC" → "cong-ty-tnhh-abc". Append suffix nếu trùng. */
    private String deriveSlug(String companyName) {
        String base = companyName
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "")
                .substring(0, Math.min(companyName.length(), 32));
        if (base.isEmpty()) {
            base = "tenant";
        }
        String candidate = base;
        int suffix = 1;
        while (tenantRepo.existsBySlug(candidate)) {
            candidate = base + "-" + suffix++;
            if (suffix > 99) {
                candidate = base + "-" + System.currentTimeMillis() % 10_000;
                break;
            }
        }
        return candidate;
    }
}
