package com.cachesol.platform.registry.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public class CreateMiniAppRequest {
    @NotBlank @Size(max = 50) public String code;
    @NotBlank public String name;
    public String description;
    public String version;          // default "0.0.1"
    public String category;          // default "OTHER"
    public String iconUrl;
    public String documentationUrl;
    public BigDecimal basePrice;
    public boolean core;             // default false
    public boolean active;           // default true

    public CreateMiniAppRequest() {}
}
