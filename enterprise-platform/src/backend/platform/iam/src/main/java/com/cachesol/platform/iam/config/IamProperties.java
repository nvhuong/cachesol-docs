package com.cachesol.platform.iam.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "iam")
public class IamProperties {

    /** JWKS cache TTL in ms (default 1h). */
    private long jwksCacheTtl = 3_600_000;

    private Webhook webhook = new Webhook();

    public long getJwksCacheTtl() { return jwksCacheTtl; }
    public Webhook getWebhook() { return webhook; }

    public static class Webhook {
        private String hmacSecret = "changeme";
        private String forwardToKafkaTopic = "keycloak.events";
        private int maxRetries = 3;

        public String getHmacSecret() { return hmacSecret; }
        public void setHmacSecret(String s) { this.hmacSecret = s; }
        public String getForwardToKafkaTopic() { return forwardToKafkaTopic; }
        public void setForwardToKafkaTopic(String t) { this.forwardToKafkaTopic = t; }
        public int getMaxRetries() { return maxRetries; }
        public void setMaxRetries(int r) { this.maxRetries = r; }
    }
}
