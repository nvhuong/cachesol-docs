package com.cachesol.platform.shared.logging;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.MDC;

import java.util.Map;

/**
 * MaskUtils — Che giấu PII khi log. KHÔNG BAO GIỜ log trực tiếp password, JWT,
 * CMND/CCCD, số tài khoản, số thẻ tín dụng.
 */
public final class MaskUtils {

    private MaskUtils() {}

    private static final ObjectMapper MAPPER = new ObjectMapper();

    public static String maskEmail(String email) {
        if (email == null || email.isBlank()) return null;
        int at = email.indexOf('@');
        if (at <= 0) return "***";
        String local = email.substring(0, at);
        String domain = email.substring(at);
        if (local.length() <= 2) return "***" + domain;
        return local.charAt(0) + "***" + domain;
    }

    public static String maskPhone(String phone) {
        if (phone == null || phone.isBlank()) return null;
        String digits = phone.replaceAll("\\D", "");
        if (digits.length() <= 4) return "****";
        return "****" + digits.substring(digits.length() - 4);
    }

    public static String maskCardNumber(String card) {
        if (card == null || card.isBlank()) return null;
        String digits = card.replaceAll("\\D", "");
        if (digits.length() <= 4) return "****";
        return "**** **** **** " + digits.substring(digits.length() - 4);
    }

    public static String maskNationalId(String id) {
        if (id == null || id.isBlank()) return null;
        if (id.length() <= 6) return "***";
        return id.substring(0, 3) + "******" + id.substring(id.length() - 3);
    }

    public static String maskSecret(String secret) {
        if (secret == null) return null;
        return "***[" + secret.length() + "]";
    }

    public static Map<String, Object> maskFields(Map<String, Object> source, String... fieldsToMask) {
        if (source == null) return null;
        java.util.Map<String, Object> copy = new java.util.HashMap<>(source);
        for (String f : fieldsToMask) {
            if (copy.containsKey(f)) copy.put(f, "***");
        }
        return java.util.Collections.unmodifiableMap(copy);
    }

    public static String toJsonSafe(Object obj, String... maskFields) {
        if (obj == null) return "null";
        try {
            String json = MAPPER.writeValueAsString(obj);
            for (String field : maskFields) {
                json = json.replaceAll(
                        "\"" + java.util.regex.Pattern.quote(field) + "\"\\s*:\\s*\"[^\"]*\"",
                        "\"" + field + "\":\"***\""
                );
            }
            return json;
        } catch (JsonProcessingException e) {
            return "<unserializable: " + obj.getClass().getSimpleName() + ">";
        }
    }

    public static String mdc(String key) {
        String v = MDC.get(key);
        return v == null ? "" : v;
    }
}
