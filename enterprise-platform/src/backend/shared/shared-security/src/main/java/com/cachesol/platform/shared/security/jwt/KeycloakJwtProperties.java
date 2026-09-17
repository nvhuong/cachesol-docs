package com.cachesol.platform.shared.security.jwt;

/**
 * Configurable properties cho {@link KeycloakJwtVerifier}.
 * Prefix: {@code shared-security.keycloak}.
 */
public class KeycloakJwtProperties {

    private String serverUrl        = "http://keycloak:8080";
    private String realm             = "cachesol";
    private String audience;
    private String issuer;
    private String jwksUrl;
    private long   jwksCacheTtl      = 3_600_000L;
    private long   clockSkewSeconds  = 30L;

    public String getServerUrl() { return serverUrl; }
    public void setServerUrl(String v) { this.serverUrl = v; }
    public String getRealm() { return realm; }
    public void setRealm(String v) { this.realm = v; }
    public String getAudience() { return audience; }
    public void setAudience(String v) { this.audience = v; }
    public String getIssuer() { return issuer; }
    public void setIssuer(String v) { this.issuer = v; }
    public String getJwksUrl() { return jwksUrl; }
    public void setJwksUrl(String v) { this.jwksUrl = v; }
    public long getJwksCacheTtl() { return jwksCacheTtl; }
    public void setJwksCacheTtl(long v) { this.jwksCacheTtl = v; }
    public long getClockSkewSeconds() { return clockSkewSeconds; }
    public void setClockSkewSeconds(long v) { this.clockSkewSeconds = v; }
}
