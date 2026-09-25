package com.cachesol.platform.registry.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * Public tenant registration payload — khớp với {@code RegistrationRequest} của frontend.
 *
 * <p>Format:
 * <pre>
 * {
 *   "company":     { "companyName": "...", "taxCode": "...", "country": "VN", ... },
 *   "contact":     { "fullName": "...", "email": "...", "phone": "...", "jobTitle": "..." },
 *   "subscription":{ "selectedMiniAppIds": ["hrm","sales"], "estimatedSeats": 10, "billingCurrency": "VND" },
 *   "consents":    { "termsAccepted": true, "privacyAccepted": true, "marketingOptIn": false },
 *   "referrer":    "..."
 * }
 * </pre>
 */
public class PublicRegistrationRequest {

    @NotNull @Valid
    public CompanyInfo company;

    @NotNull @Valid
    public ContactInfo contact;

    @NotNull @Valid
    public SubscriptionInfo subscription;

    @NotNull
    public Consents consents;

    public String referrer;

    public PublicRegistrationRequest() {}

    public static class CompanyInfo {
        @NotBlank @Size(min = 2, max = 255)
        public String companyName;

        public String taxCode;

        @NotBlank
        @Pattern(regexp = "^[A-Z]{2}$", message = "country phải là ISO 3166-1 alpha-2 (VD: VN, SG, US)")
        public String country;

        /** micro | small | medium | large | enterprise (optional) */
        public String companySize;
        public String industry;
        public String website;
        public String province;
        public String addressLine;
    }

    public static class ContactInfo {
        @NotBlank public String fullName;

        @NotBlank
        @Pattern(regexp = "^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$", message = "email không hợp lệ")
        public String email;

        public String phone;
        public String jobTitle;
    }

    public static class SubscriptionInfo {
        @NotNull
        public List<String> selectedMiniAppIds;

        @NotNull
        public Integer estimatedSeats;

        @NotBlank
        public String billingCurrency;
    }

    public static class Consents {
        public boolean termsAccepted;
        public boolean privacyAccepted;
        public Boolean marketingOptIn;
    }
}
