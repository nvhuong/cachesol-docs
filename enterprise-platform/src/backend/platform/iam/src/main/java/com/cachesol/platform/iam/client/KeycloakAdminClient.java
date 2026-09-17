package com.cachesol.platform.iam.client;

import com.cachesol.platform.iam.config.IamProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.*;

/**
 * Thin wrapper cho Keycloak Admin REST API.
 *
 * - Token cache tự động (refresh khi gần hết hạn).
 * - Sử dụng RestClient (Spring Boot 3.2+).
 * - Tất cả method idempotent ở mức caller (vd. create realm trả 409 nếu đã tồn tại → bỏ qua).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KeycloakAdminClient {

    private final IamProperties props;

    private volatile String cachedMasterToken;
    private volatile long   cachedMasterTokenExpiresAt = 0L;
    private final Object tokenLock = new Object();

    // ====================================================================
    // ===== REALM OPERATIONS ==============================================
    // ====================================================================

    /** Tạo realm (idempotent — nếu đã tồn tại return false). */
    public boolean createRealm(String realmName, String displayName) {
        try {
            ensureMasterToken();
            realmClient(realmName).post()
                    .uri("/admin/realms")
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(realmRequest(realmName, displayName))
                    .retrieve()
                    .toBodilessEntity();
            log.info("Keycloak realm created: {}", realmName);
            return true;
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                log.info("Realm {} đã tồn tại, skip", realmName);
                return false;
            }
            // Keycloak returns 409 sometimes with text/html — accept existing
            String body = ex.getResponseBodyAsString();
            if (body != null && body.contains("already exists")) {
                return false;
            }
            throw new KeycloakOperationException(
                    "createRealm", realmName, ex.getStatusCode(), body, ex);
        }
    }

    /** Lấy thông tin realm (null nếu chưa tồn tại). */
    public Map<String, Object> getRealm(String realmName) {
        try {
            ensureMasterToken();
            return realmClient(realmName).get()
                    .uri("/admin/realms/{realm}", realmName)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .body(Map.class);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return null;
            throw new KeycloakOperationException(
                    "getRealm", realmName, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    /** Xoá realm. */
    public void deleteRealm(String realmName) {
        try {
            ensureMasterToken();
            realmClient(realmName).delete()
                    .uri("/admin/realms/{realm}", realmName)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return;
            throw new KeycloakOperationException(
                    "deleteRealm", realmName, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    // ====================================================================
    // ===== USER OPERATIONS ===============================================
    // ====================================================================

    /** Tạo user trong realm — trả về Keycloak user id (UUID). Nếu đã tồn tại trả về id cũ. */
    public String createUser(String realm, String username, String email,
                              String firstName, String lastName,
                              String password, boolean enabled) {
        // Check exists
        String existing = findUserIdByUsername(realm, username);
        if (existing != null) {
            log.info("User {} đã tồn tại trong realm {}: id={}", username, realm, existing);
            return existing;
        }
        ensureRealmToken(realm);
        UserRepresentation u = new UserRepresentation();
        u.username = username;
        u.email = email;
        u.firstName = firstName;
        u.lastName = lastName;
        u.enabled = enabled;
        u.emailVerified = true;
        if (password != null) {
            CredentialRepresentation cred = new CredentialRepresentation();
            cred.type = "password";
            cred.value = password;
            cred.temporary = false;
            u.credentials = List.of(cred);
        }
        try {
            Map<String, Object> resp = realmClient(realm).post()
                    .uri("/admin/realms/{realm}/users", realm)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(u)
                    .retrieve()
                    .body(Map.class);
            // Keycloak returns 201 + Location header; fallback to lookup
            String id = lookupUserIdByUsername(realm, username);
            log.info("Created Keycloak user realm={} username={} id={}", realm, username, id);
            return id != null ? id : null;
        } catch (HttpClientErrorException ex) {
            throw new KeycloakOperationException(
                    "createUser", realm + "/" + username, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    /** Lookup user by username; null nếu không có. */
    public String findUserIdByUsername(String realm, String username) {
        return lookupUserIdByUsername(realm, username);
    }

    /** Trả về full user representation (id, email, firstName, ...). */
    public Map<String, Object> findUserRepresentation(String realm, String username) {
        try {
            ensureMasterToken();
            List<Map<String, Object>> users = realmClient(realm).get()
                    .uri(uri -> uri.path("/admin/realms/{realm}/users")
                            .queryParam("username", username).build(realm))
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .body(List.class);
            return users != null && !users.isEmpty() ? users.get(0) : null;
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return null;
            log.warn("Lookup user failed realm={} u={}: {}", realm, username, ex.getMessage());
            return null;
        }
    }

    /** Lấy realm roles đã gán cho user. */
    @SuppressWarnings("unchecked")
    public List<String> getUserRealmRoles(String realm, String userId) {
        try {
            ensureMasterToken();
            List<Map<String, Object>> roles = realmClient(realm).get()
                    .uri("/admin/realms/{realm}/users/{id}/role-mappings/realm",
                            realm, userId)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .body(List.class);
            if (roles == null) return List.of();
            List<String> names = new ArrayList<>();
            for (Map<String, Object> r : roles) {
                Object n = r.get("name");
                if (n != null) names.add(n.toString());
            }
            return names;
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return List.of();
            log.warn("getUserRealmRoles failed realm={} id={}: {}", realm, userId, ex.getMessage());
            return List.of();
        }
    }

    /** Search user by email. */
    public String findUserIdByEmail(String realm, String email) {
        try {
            ensureMasterToken();
            List<Map<String, Object>> users = realmClient(realm).get()
                    .uri(uri -> uri.path("/admin/realms/{realm}/users")
                            .queryParam("email", email).build(realm))
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .body(List.class);
            return users != null && !users.isEmpty() && users.get(0).get("id") != null
                    ? users.get(0).get("id").toString() : null;
        } catch (HttpClientErrorException ex) {
            return null;
        }
    }

    private String lookupUserIdByUsername(String realm, String username) {
        try {
            ensureMasterToken();
            List<Map<String, Object>> users = realmClient(realm).get()
                    .uri(uri -> uri.path("/admin/realms/{realm}/users")
                            .queryParam("username", username).build(realm))
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .body(List.class);
            if (users != null && !users.isEmpty()) {
                Object id = users.get(0).get("id");
                return id == null ? null : id.toString();
            }
            return null;
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return null;
            log.warn("Lookup user failed realm={} u={}: {}", realm, username, ex.getMessage());
            return null;
        }
    }

    public void deleteUser(String realm, String userId) {
        try {
            ensureMasterToken();
            realmClient(realm).delete()
                    .uri("/admin/realms/{realm}/users/{id}", realm, userId)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return;
            throw new KeycloakOperationException(
                    "deleteUser", realm + "/" + userId, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    /** Reset password cho user. */
    public void resetPassword(String realm, String userId, String password, boolean temporary) {
        ensureMasterToken();
        CredentialRepresentation c = new CredentialRepresentation();
        c.type = "password";
        c.value = password;
        c.temporary = temporary;
        try {
            realmClient(realm).put()
                    .uri("/admin/realms/{realm}/users/{id}/reset-password", realm, userId)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(c)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ex) {
            throw new KeycloakOperationException(
                    "resetPassword", realm + "/" + userId, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    /** Lấy full user representation theo id. */
    public Map<String, Object> findUserById(String realm, String userId) {
        try {
            ensureMasterToken();
            return realmClient(realm).get()
                    .uri("/admin/realms/{realm}/users/{id}", realm, userId)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .body(Map.class);
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return null;
            log.warn("findUserById failed realm={} id={}: {}", realm, userId, ex.getMessage());
            return null;
        }
    }

    /** Thêm user vào group (Keycloak group = org tree node). */
    public void addUserToGroup(String realm, String userId, String groupId) {
        ensureMasterToken();
        try {
            realmClient(realm).put()
                    .uri("/admin/realms/{realm}/users/{userId}/groups/{groupId}", realm, userId, groupId)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ex) {
            throw new KeycloakOperationException(
                    "addUserToGroup", realm + "/" + userId + "→" + groupId, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    /** Gỡ user khỏi group. */
    public void removeUserFromGroup(String realm, String userId, String groupId) {
        ensureMasterToken();
        try {
            realmClient(realm).delete()
                    .uri("/admin/realms/{realm}/users/{userId}/groups/{groupId}", realm, userId, groupId)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return;
            throw new KeycloakOperationException(
                    "removeUserFromGroup", realm + "/" + userId + "→" + groupId, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    // ====================================================================
    // ===== REALM ROLE OPERATIONS =========================================
    // ====================================================================

    public boolean createRealmRole(String realm, String roleName, String description) {
        try {
            ensureMasterToken();
            RealmRoleRepresentation r = new RealmRoleRepresentation();
            r.name = roleName;
            r.description = description;
            realmClient(realm).post()
                    .uri("/admin/realms/{realm}/roles", realm)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(r)
                    .retrieve()
                    .toBodilessEntity();
            return true;
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) return false;
            String body = ex.getResponseBodyAsString();
            if (body != null && body.contains("exists")) return false;
            throw new KeycloakOperationException(
                    "createRealmRole", realm + "/" + roleName, ex.getStatusCode(),
                    body, ex);
        }
    }

    public List<Map<String, Object>> listRealmRoles(String realm) {
        try {
            ensureMasterToken();
            List<Map<String, Object>> roles = realmClient(realm).get()
                    .uri("/admin/realms/{realm}/roles", realm)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .body(List.class);
            return roles != null ? roles : List.of();
        } catch (HttpClientErrorException ex) {
            throw new KeycloakOperationException(
                    "listRealmRoles", realm, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    /** Gán realm role cho user (PUT). */
    public void assignRealmRoleToUser(String realm, String userId, String roleName) {
        ensureMasterToken();
        RealmRoleRepresentation r = new RealmRoleRepresentation();
        r.name = roleName;
        try {
            realmClient(realm).post()
                    .uri("/admin/realms/{realm}/users/{id}/role-mappings/realm", realm, userId)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(List.of(r))
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ex) {
            throw new KeycloakOperationException(
                    "assignRealmRole", realm + "/" + userId + "/" + roleName, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    public void revokeRealmRoleFromUser(String realm, String userId, String roleName) {
        ensureMasterToken();
        RealmRoleRepresentation r = new RealmRoleRepresentation();
        r.name = roleName;
        try {
            realmClient(realm).method(org.springframework.http.HttpMethod.DELETE)
                    .uri("/admin/realms/{realm}/users/{id}/role-mappings/realm", realm, userId)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(List.of(r))
                    .retrieve()
                    .toBodilessEntity();
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.NOT_FOUND) return;
            throw new KeycloakOperationException(
                    "revokeRealmRole", realm + "/" + userId + "/" + roleName, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    // ====================================================================
    // ===== GROUP OPERATIONS ==============================================
    // ====================================================================

    public String createGroup(String realm, String name, String path) {
        try {
            ensureMasterToken();
            GroupRepresentation g = new GroupRepresentation();
            g.name = name;
            g.path = path != null ? path : ("/" + name);
            Map<String, Object> resp = realmClient(realm).post()
                    .uri("/admin/realms/{realm}/groups", realm)
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(g)
                    .retrieve()
                    .body(Map.class);
            return resp != null && resp.get("id") != null ? resp.get("id").toString() : null;
        } catch (HttpClientErrorException ex) {
            if (ex.getStatusCode() == HttpStatus.CONFLICT) {
                return findGroupIdByPath(realm, "/" + name);
            }
            throw new KeycloakOperationException(
                    "createGroup", realm + "/" + name, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    private String findGroupIdByPath(String realm, String path) {
        try {
            ensureMasterToken();
            List<Map<String, Object>> groups = realmClient(realm).get()
                    .uri(uri -> uri.path("/admin/realms/{realm}/groups")
                            .queryParam("search", path).build(realm))
                    .header("Authorization", "Bearer " + cachedMasterToken)
                    .retrieve()
                    .body(List.class);
            if (groups != null) {
                for (Map<String, Object> g : groups) {
                    if (path.equals(g.get("path"))) {
                        return g.get("id").toString();
                    }
                }
            }
        } catch (HttpClientErrorException ignored) {}
        return null;
    }

    // ====================================================================
    // ===== TOKEN OPS =====================================================
    // ====================================================================

    /** Lấy admin token của realm cụ thể (qua password grant). */
    public String userLogin(String realm, String username, String password, String clientId, String clientSecret) {
        try {
            RestClient client = RestClient.builder()
                    .baseUrl(props.getKeycloak().getServerUrl())
                    .build();
            Map<String, String> form = new LinkedHashMap<>();
            form.put("grant_type", "password");
            form.put("client_id", clientId);
            if (clientSecret != null && !clientSecret.isBlank()) {
                form.put("client_secret", clientSecret);
            }
            form.put("username", username);
            form.put("password", password);
            Map<String, Object> resp = client.post()
                    .uri(uri -> uri.path("/realms/{realm}/protocol/openid-connect/token").build(realm))
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(joinForm(form))
                    .retrieve()
                    .body(Map.class);
            return resp != null && resp.get("access_token") != null
                    ? resp.get("access_token").toString() : null;
        } catch (HttpClientErrorException ex) {
            throw new KeycloakOperationException(
                    "userLogin", realm + "/" + username, ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    // ====================================================================
    // ===== internal =====================================================
    // ====================================================================

    private void ensureRealmToken(String realm) {
        // Hiện tại dùng chung master token vì admin có quyền mọi realm.
        ensureMasterToken();
    }

    private void ensureMasterToken() {
        long now = System.currentTimeMillis();
        if (cachedMasterToken != null && now < cachedMasterTokenExpiresAt - 60_000L) {
            return;
        }
        synchronized (tokenLock) {
            if (cachedMasterToken != null && System.currentTimeMillis() < cachedMasterTokenExpiresAt - 60_000L) {
                return;
            }
            fetchMasterToken();
        }
    }

    private void fetchMasterToken() {
        try {
            RestClient client = RestClient.builder()
                    .baseUrl(props.getKeycloak().getServerUrl())
                    .build();
            Map<String, String> form = new LinkedHashMap<>();
            form.put("grant_type", "password");
            form.put("client_id", props.getKeycloak().getAdminClientId());
            form.put("username", props.getKeycloak().getAdminUsername());
            form.put("password", props.getKeycloak().getAdminPassword());
            Map<String, Object> resp = client.post()
                    .uri("/realms/master/protocol/openid-connect/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(joinForm(form))
                    .retrieve()
                    .body(Map.class);
            this.cachedMasterToken = resp.get("access_token").toString();
            long expiresIn = ((Number) resp.getOrDefault("expires_in", 300)).longValue();
            this.cachedMasterTokenExpiresAt = System.currentTimeMillis() + expiresIn * 1000L;
        } catch (HttpClientErrorException ex) {
            throw new KeycloakOperationException(
                    "fetchMasterToken", "master", ex.getStatusCode(),
                    ex.getResponseBodyAsString(), ex);
        }
    }

    private RestClient realmClient(String realm) {
        return RestClient.builder()
                .baseUrl(props.getKeycloak().getServerUrl())
                .build();
    }

    private Map<String, Object> realmRequest(String realm, String displayName) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("realm", realm);
        body.put("enabled", true);
        body.put("registrationAllowed", false);
        body.put("loginWithEmailAllowed", true);
        body.put("duplicateEmailsAllowed", false);
        body.put("verifyEmail", false);
        body.put("resetPasswordAllowed", true);
        body.put("editUsernameAllowed", true);
        body.put("bruteForceProtected", true);
        body.put("accessTokenLifespan", 1800); // 30 min
        if (displayName != null) body.put("displayName", displayName);
        return body;
    }

    private static String joinForm(Map<String, String> form) {
        StringBuilder sb = new StringBuilder();
        form.forEach((k, v) -> sb.append(k).append('=').append(urlEncode(v)).append('&'));
        if (sb.length() > 0) sb.setLength(sb.length() - 1);
        return sb.toString();
    }

    private static String urlEncode(String s) {
        if (s == null) return "";
        return java.net.URLEncoder.encode(s, java.nio.charset.StandardCharsets.UTF_8);
    }

    // ====================================================================
    // ===== DTOs ==========================================================
    // ====================================================================

    @Data @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class UserRepresentation {
        public String username;
        public String email;
        public String firstName;
        public String lastName;
        public Boolean enabled;
        @JsonProperty("emailVerified") public Boolean emailVerified;
        @JsonProperty("credentials") public List<CredentialRepresentation> credentials;
    }

    @Data @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class CredentialRepresentation {
        public String type;
        public String value;
        public Boolean temporary;
    }

    @Data @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class RealmRoleRepresentation {
        public String id;
        public String name;
        public String description;
        public Boolean composite;
        @JsonProperty("clientRole") public Boolean clientRole;
        public String containerId;
    }

    @Data @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class GroupRepresentation {
        public String id;
        public String name;
        public String path;
        public Map<String, List<String>> attributes;
    }

    public static class KeycloakOperationException extends RuntimeException {
        private final String operation;
        private final String target;
        private final HttpStatusCode status;
        public KeycloakOperationException(String op, String target,
                                          HttpStatusCode status, String body, Throwable cause) {
            super("Keycloak " + op + " failed [" + status + "] for " + target + ": " + body, cause);
            this.operation = op;
            this.target = target;
            this.status = status;
        }
        public String getOperation() { return operation; }
        public String getTarget() { return target; }
        public HttpStatusCode getStatus() { return status; }
    }
}
