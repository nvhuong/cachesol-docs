package com.cachesol.platform.registry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Map;
import java.util.UUID;

public class UpdateTenantRequest {
    public String displayName;
    public String legalName;
    public String taxCode;
    public String plan;
    public String defaultLocale;
    public String defaultCurrency;
    public String defaultTimezone;
    public String contactEmail;
    public String contactPhone;
    public String loginFlowAlias;

    /** Cho phép đổi role template snapshot mặc định. */
    public UUID roleTemplateId;

    public Map<String, Object> metadata;

    public UpdateTenantRequest() {}
}
