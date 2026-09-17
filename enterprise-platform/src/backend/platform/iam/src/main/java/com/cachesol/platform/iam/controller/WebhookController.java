package com.cachesol.platform.iam.controller;

import com.cachesol.platform.iam.config.IamProperties;
import com.cachesol.platform.iam.service.WebhookForwarder;
import com.cachesol.platform.shared.common.api.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.HexFormat;

/**
 * INTEGRATION-API — receives lifecycle events from Keycloak SPI.
 *
 * Keycloak SPI calls this endpoint with an HMAC-SHA256 signature header.
 * We verify the signature before processing.
 *
 * POST /integration-api/v1/webhooks/keycloak
 * Header: X-Keycloak-Signature: sha256=<hex>
 * Body: JSON payload from Keycloak
 */
@Slf4j
@RestController
@RequestMapping("/integration-api/v1/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private static final String SIGNATURE_HEADER = "X-Keycloak-Signature";
    private static final String HMAC_ALGO = "HmacSHA256";
    private static final String SIG_PREFIX = "sha256=";

    private final IamProperties iamProps;
    private final WebhookForwarder forwarder;

    /**
     * Receive event from Keycloak SPI, verify HMAC, then forward to Kafka.
     */
    @PostMapping("/keycloak")
    public ResponseEntity<ApiResponse<Map<String, Object>>> handleKeycloakWebhook(
            @RequestHeader(value = SIGNATURE_HEADER, required = false) String signatureHeader,
            @RequestBody Map<String, Object> payload) {

        String hmacSecret = iamProps.getWebhook().getHmacSecret();

        // 1. Verify HMAC signature
        if (signatureHeader == null || !signatureHeader.startsWith(SIG_PREFIX)) {
            log.warn("Missing or malformed {} header from Keycloak", SIGNATURE_HEADER);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail("UNAUTHORIZED", "Missing or invalid signature header"));
        }

        String expectedHex = signatureHeader.substring(SIG_PREFIX.length());
        String bodyJson = payload != null ? payload.toString() : "";

        String computed = computeHmac(bodyJson, hmacSecret);

        if (!MessageDigest.isEqual(
                expectedHex.toLowerCase().getBytes(StandardCharsets.UTF_8),
                computed.getBytes(StandardCharsets.UTF_8))) {
            log.warn("HMAC signature mismatch for Keycloak webhook. Expected={}, Computed={}", expectedHex, computed);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail("UNAUTHORIZED", "Signature verification failed"));
        }

        // 2. Extract realm from payload
        String realm = extractRealm(payload);
        String eventType = extractEventType(payload);

        log.info("Received Keycloak webhook: realm={}, eventType={}", realm, eventType);

        // 3. Forward to Kafka
        String topic = iamProps.getWebhook().getForwardToKafkaTopic() + "." + (realm != null ? realm : "unknown");
        try {
            forwarder.forward(topic, payload);
        } catch (Exception e) {
            log.error("Failed to forward Keycloak event to Kafka topic {}: {}", topic, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.fail("FORWARD_FAILED", "Failed to forward event: " + e.getMessage()));
        }

        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "received", true,
                "eventType", eventType != null ? eventType : "unknown",
                "realm", realm != null ? realm : "unknown"
        )));
    }

    private String computeHmac(String data, String secret) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGO);
            SecretKeySpec keySpec = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), HMAC_ALGO);
            mac.init(keySpec);
            byte[] raw = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(raw);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException("HMAC computation failed", e);
        }
    }

    private String extractRealm(Map<String, Object> payload) {
        if (payload == null) return null;
        // Keycloak events typically include 'realm_id' or nested 'execution_realm_id'
        Object realm = payload.get("realm_id");
        if (realm == null) {
            Object details = payload.get("details");
            if (details instanceof Map) {
                realm = ((Map<?, ?>) details).get("realm_id");
            }
        }
        return realm != null ? realm.toString() : null;
    }

    private String extractEventType(Map<String, Object> payload) {
        if (payload == null) return null;
        Object type = payload.get("type");
        if (type == null) type = payload.get("event_type");
        return type != null ? type.toString() : null;
    }
}
