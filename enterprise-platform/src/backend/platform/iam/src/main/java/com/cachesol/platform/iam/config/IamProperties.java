package com.cachesol.platform.iam.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "iam")
public class IamProperties {

    /** JWKS cache TTL in ms (default 1h). */
    private long jwksCacheTtl = 3_600_000;

    private Webhook webhook = new Webhook();
    private Keycloak keycloak = new Keycloak();

    public long getJwksCacheTtl() { return jwksCacheTtl; }
    public Webhook getWebhook() { return webhook; }
    public Keycloak getKeycloak() { return keycloak; }

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

    public static class Keycloak {
        private String serverUrl        = "http://keycloak:8080";
        private String realm             = "cachesol";
        private String adminClientId     = "admin-cli";
        private String adminUsername     = "admin";
        private String adminPassword     = "admin";
        private String adminClientSecret = "admin-cli-secret";

        public String getServerUrl() { return serverUrl; }
        public void setServerUrl(String v) { this.serverUrl = v; }
        public String getRealm() { return realm; }
        public void setRealm(String v) { this.realm = v; }
        public String getAdminClientId() { return adminClientId; }
        public void setAdminClientId(String v) { this.adminClientId = v; }
        public String getAdminUsername() { return adminUsername; }
        public void setAdminUsername(String v) { this.adminUsername = v; }
        public String getAdminPassword() { return adminPassword; }
        public void setAdminPassword(String v) { this.adminPassword = v; }
        public String getAdminClientSecret() { return adminClientSecret; }
        public void setAdminClientSecret(String v) { this.adminClientSecret = v; }
    }
}
