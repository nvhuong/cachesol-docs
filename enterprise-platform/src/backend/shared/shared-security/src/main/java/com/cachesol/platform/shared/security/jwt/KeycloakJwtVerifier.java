package com.cachesol.platform.shared.security.jwt;

import com.cachesol.platform.shared.security.jwt.AuthenticatedUser;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jose.jwk.JWK;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.SignedJWT;

import java.net.URL;
import java.text.ParseException;
import java.time.Instant;
import java.util.*;

/**
 * Utility — decode + verify Keycloak JWT (RS256).
 *
 * Designed để dùng CHUNG giữa gateway (Spring Security Resource Server) và các service
 * cần decode token trong controller (vd. keycloak_user_id claim).
 *
 * Singletons / caching tầng service nên giữ, class này stateless.
 */
public class KeycloakJwtVerifier {

    private final String jwksUrl;
    private final String expectedIssuer;
    private final String expectedAudience;
    private final long clockSkewSeconds;
    private final long jwksCacheTtlMs;

    private volatile long cachedJwksAt = 0L;
    private volatile JWKSet cachedJwks;
    private volatile String cachedKeycloakUserId;
    private final Object lock = new Object();

    public KeycloakJwtVerifier(String jwksUrl,
                               String expectedIssuer,
                               String expectedAudience,
                               long clockSkewSeconds,
                               long jwksCacheTtlMs) {
        this.jwksUrl = jwksUrl;
        this.expectedIssuer = expectedIssuer;
        this.expectedAudience = expectedAudience;
        this.clockSkewSeconds = clockSkewSeconds;
        this.jwksCacheTtlMs = jwksCacheTtlMs;
    }

    public AuthenticatedUser verify(String token) {
        if (token == null || token.isBlank()) {
            throw new InvalidJwtException("EMPTY", "Token rỗng");
        }
        try {
            SignedJWT jwt = SignedJWT.parse(token);

            // 1. Signature
            JWK jwk = findJwk(jwt.getHeader().getKeyID());
            if (jwk == null) {
                refreshJwks();
                jwk = findJwk(jwt.getHeader().getKeyID());
                if (jwk == null) {
                    throw new InvalidJwtException("UNKNOWN_KID",
                            "Không tìm thấy JWK cho kid=" + jwt.getHeader().getKeyID());
                }
            }
            JWSVerifier verifier = new RSASSAVerifier(((RSAKey) jwk).toRSAPublicKey());
            if (!jwt.verify(verifier)) {
                throw new InvalidJwtException("BAD_SIGNATURE", "JWT signature không hợp lệ");
            }

            // 2. Parse claims
            var claims = jwt.getJWTClaimsSet();
            String issuer = claims.getIssuer();
            if (expectedIssuer != null && !expectedIssuer.isBlank()
                    && !expectedIssuer.equals(issuer)) {
                throw new InvalidJwtException("BAD_ISSUER",
                        "Expected issuer=" + expectedIssuer + " nhưng nhận=" + issuer);
            }
            if (expectedAudience != null && !expectedAudience.isBlank()) {
                List<String> aud = claims.getAudience();
                if (aud == null || !aud.contains(expectedAudience)) {
                    throw new InvalidJwtException("BAD_AUDIENCE",
                            "Expected aud=" + expectedAudience);
                }
            }
            Date now = new Date();
            if (claims.getExpirationTime() != null &&
                    claims.getExpirationTime().toInstant()
                            .isBefore(Instant.now().minusSeconds(clockSkewSeconds))) {
                throw new InvalidJwtException("EXPIRED", "JWT đã hết hạn");
            }
            if (claims.getNotBeforeTime() != null &&
                    claims.getNotBeforeTime().toInstant()
                            .isAfter(Instant.now().plusSeconds(clockSkewSeconds))) {
                throw new InvalidJwtException("NOT_YET_VALID", "JWT chưa có hiệu lực");
            }

            // 3. Build principal
            String subject = claims.getSubject();
            UUID userId = parseUuidSafe(subject);
            String username = stringClaimSafe(claims, "preferred_username");
            String email = stringClaimSafe(claims, "email");
            String tenantSlug = stringClaimSafe(claims, "tenant");
            Set<String> realmRoles = readRealmRoles(claims);
            boolean serviceAccount = "service-account".equals(stringClaimSafe(claims, "typ"))
                    || (subject != null && subject.startsWith("service-account-"));
            return new AuthenticatedUser(userId, username, email, tenantSlug, realmRoles, serviceAccount);
        } catch (InvalidJwtException e) {
            throw e;
        } catch (ParseException e) {
            throw new InvalidJwtException("PARSE_ERROR", "JWT parse failed: " + e.getMessage());
        } catch (Exception e) {
            throw new InvalidJwtException("VERIFY_ERROR", "Lỗi verify JWT: " + e.getMessage());
        }
    }

    /**
     * Lấy token từ header Authorization: Bearer xxx.
     */
    public AuthenticatedUser verifyAuthorizationHeader(String header) {
        if (header == null) throw new InvalidJwtException("EMPTY", "Authorization header rỗng");
        if (!header.startsWith("Bearer ")) {
            throw new InvalidJwtException("BAD_SCHEME", "Authorization phải bắt đầu bằng 'Bearer '");
        }
        return verify(header.substring("Bearer ".length()).trim());
    }

    // ---------------- internal ----------------

    private JWK findJwk(String kid) throws Exception {
        ensureJwks();
        if (kid == null) {
            // fall back to first key
            return cachedJwks.getKeys().get(0);
        }
        return cachedJwks.getKeyByKeyId(kid);
    }

    private void ensureJwks() throws Exception {
        long now = System.currentTimeMillis();
        if (cachedJwks != null && (now - cachedJwksAt) < jwksCacheTtlMs) {
            return;
        }
        synchronized (lock) {
            if (cachedJwks != null && (System.currentTimeMillis() - cachedJwksAt) < jwksCacheTtlMs) {
                return;
            }
            refreshJwks();
        }
    }

    private void refreshJwks() throws Exception {
        JWKSet set = JWKSet.load(new URL(jwksUrl));
        this.cachedJwks = set;
        this.cachedJwksAt = System.currentTimeMillis();
        this.cachedKeycloakUserId = null;
    }

    @SuppressWarnings("unchecked")
    private Set<String> readRealmRoles(com.nimbusds.jwt.JWTClaimsSet claims) {
        Set<String> result = new HashSet<>();
        Object realmAccess = claims.getClaim("realm_access");
        if (realmAccess instanceof Map<?, ?> map) {
            Object rolesObj = map.get("roles");
            if (rolesObj instanceof List<?> list) {
                for (Object r : list) if (r != null) result.add(r.toString());
            }
        }
        return result;
    }

    private String stringClaimSafe(com.nimbusds.jwt.JWTClaimsSet claims, String name) {
        try {
            return claims.getStringClaim(name);
        } catch (java.text.ParseException e) {
            return null;
        }
    }

    private UUID parseUuidSafe(String s) {
        if (s == null || s.isBlank()) return null;
        try { return UUID.fromString(s); } catch (Exception e) { return null; }
    }

    public static class InvalidJwtException extends RuntimeException {
        private final String code;
        public InvalidJwtException(String code, String msg) { super(msg); this.code = code; }
        public String getCode() { return code; }
    }
}
