package com.cachesol.platform.registry.dto;

import jakarta.validation.constraints.NotNull;

import java.util.Map;
import java.util.UUID;

public class EnableMiniAppRequest {
    @NotNull public UUID miniAppId;
    @NotNull public UUID enabledBy;
    public boolean enabled;          // default true
    public Map<String, Object> config;
    public String notes;

    public EnableMiniAppRequest() {}
}
