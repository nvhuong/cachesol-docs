package com.cachesol.platform.shared.security.jwt;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Auto-register {@link KeycloakJwtVerifier} khi shared-security nằm trong classpath.
 *
 * Properties:
 *   shared-security.keycloak.server-url        → ví dụ http://keycloak:8080
 *   shared-security.keycloak.realm             → realm default (vd. "cachesol")
 *   shared-security.keycloak.audience          → aud claim
 *   shared-security.keycloak.jwks-cache-ttl   → milliseconds
 *   shared-security.keycloak.clock-skew-seconds→ default 30
 */
@Configuration
public class KeycloakJwtVerifierAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(KeycloakJwtVerifier.class)
    public KeycloakJwtVerifier keycloakJwtVerifier(KeycloakJwtProperties props) {
        String serverUrl = trim(props.getServerUrl(), "http://keycloak:8080");
        String realm     = trim(props.getRealm(), "cachesol");
        String jwksUrl   = trim(props.getJwksUrl(),
                serverUrl + "/realms/" + realm + "/protocol/openid-connect/certs");
        String expectedIssuer = trim(props.getIssuer(),
                serverUrl + "/realms/" + realm);
        return new KeycloakJwtVerifier(
                jwksUrl,
                expectedIssuer,
                props.getAudience(),
                props.getClockSkewSeconds() > 0 ? props.getClockSkewSeconds() : 30L,
                props.getJwksCacheTtl() > 0 ? props.getJwksCacheTtl() : 3_600_000L
        );
    }

    @Bean
    @ConditionalOnMissingBean(KeycloakJwtProperties.class)
    @ConfigurationProperties(prefix = "shared-security.keycloak")
    public KeycloakJwtProperties keycloakJwtProperties() {
        return new KeycloakJwtProperties();
    }

    private String trim(String s, String def) {
        return (s == null || s.isBlank()) ? def : s;
    }
}
