package com.cachesol.platform.registry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Map;
import java.util.UUID;

public class CreateTenantRequest {
    @NotBlank
    @Pattern(regexp = "^[a-z0-9-]{3,30}$", message = "slug chỉ chứa a-z, 0-9, '-', dài 3-30")
    public String slug;

    @NotBlank public String displayName;
    public String legalName;
    public String taxCode;
    public String plan;             // default "trial"
    public String region;           // default "vn"

    @NotBlank
    @Size(min = 3, max = 50)
    @Pattern(regexp = "^[a-z0-9-]+$", message = "keycloakRealm chỉ chứa a-z, 0-9, '-'")
    public String keycloakRealm;

    public String defaultLocale;     // default "vi"
    public String defaultCurrency;   // default "VND"
    public String defaultTimezone;   // default "Asia/Ho_Chi_Minh"

    @NotBlank public String contactEmail;
    public String contactPhone;
    public String loginFlowAlias;

    /** Role template mặc định sẽ clone khi tạo tenant. Null = dùng tất cả templates. */
    public UUID roleTemplateId;

    public Map<String, Object> metadata;

    public CreateTenantRequest() {}
}
