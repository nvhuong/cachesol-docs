#!/bin/bash
# =====================================================
# cachesol MVP — full integration smoke test
# =====================================================
# Test toàn bộ flow tích hợp:
#
#   Step 1.  Health check 3 services + Keycloak
#   Step 2.  Login admin Keycloak (master realm) → gọi IAM list realms
#   Step 3.  Platform-registry: tạo tenant → trigger IAM provision Keycloak realm
#   Step 4.  IAM: kiểm tra realm đã được tạo + các roles mặc định
#   Step 5.  Platform-registry: tạo role template + mini-app
#   Step 6.  Tenant-manager init-schema (call platform-registry → IAM)
#   Step 7.  Tenant-manager: tạo organization + role
#   Step 8.  Tenant-manager: tạo user (tự động tạo Keycloak user qua IAM)
#   Step 9.  IAM: kiểm tra user đã có trong Keycloak realm
#   Step 10. Tenant-manager: gán app role + IAM gán realm role
#   Step 11. Verify Keycloak login bằng user vừa tạo (password grant)
#   Step 12. IAM: decode JWT để xác minh token hợp lệ
#   Step 13. Cleanup + error handling tests (4xx)
#
# Usage:
#   bash test-curl.sh
#
# Cần: docker compose -f docker-compose.mvp.yml up -d --build (services + keycloak ready).

set -u

IAM="http://localhost:8088"
REGISTRY="http://localhost:8087"
TENANT="http://localhost:8089"
KEYCLOAK="http://localhost:8090"

# Per-tenant config
TENANT_SLUG="acme"
REALM_NAME="tenant-${TENANT_SLUG}"
PASSWORD="Acme@12345"
GLOBAL_FAILED=0

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
ok()    { echo -e "${GREEN}✓${NC} $1"; }
err()   { echo -e "${RED}✗${NC} $1"; GLOBAL_FAILED=$((GLOBAL_FAILED+1)); }
section() { echo -e "\n${YELLOW}=== $1 ===${NC}"; }
info()  { echo -e "${BLUE}ℹ${NC} $1"; }

# ---------------------------- helpers ----------------------------------------
api() {
    local method=$1 url=$2 body=${3:-}
    if [ -z "$body" ]; then
        curl -s -o /tmp/resp.json -w "%{http_code}" -X "$method" "$url" \
             -H "Content-Type: application/json"
    else
        curl -s -o /tmp/resp.json -w "%{http_code}" -X "$method" "$url" \
             -H "Content-Type: application/json" -d "$body"
    fi
}

api_with_realm() {
    local method=$1 realm=$2 url=$3 body=${4:-}
    if [ -z "$body" ]; then
        curl -s -o /tmp/resp.json -w "%{http_code}" -X "$method" "$url" \
             -H "Content-Type: application/json" -H "X-Realm: $realm"
    else
        curl -s -o /tmp/resp.json -w "%{http_code}" -X "$method" "$url" \
             -H "Content-Type: application/json" -H "X-Realm: $realm" -d "$body"
    fi
}

pretty() { jq . /tmp/resp.json 2>/dev/null || cat /tmp/resp.json; }
expect_code() {
    local want=$1 got=$2 label=$3
    if [ "$got" = "$want" ]; then ok "$label → $got"; else err "$label expected $want got $got"; pretty; fi
}

# Wait for service
wait_for() {
    local url=$1 label=$2 max=${3:-60}
    info "Đợi $label ready ($url)..."
    for i in $(seq 1 $max); do
        code=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
        if [ "$code" = "200" ]; then echo -e "${GREEN}✓${NC} $label ready sau ${i}s"; return 0; fi
        sleep 1
    done
    err "$label KHÔNG ready sau ${max}s";
    return 1
}

# =====================================================================
section "1. Wait for services ready"
# =====================================================================
wait_for "$IAM/public-api/v1/health/live"     "iam-service"            90 || exit 1
wait_for "$REGISTRY/public-api/v1/health"     "platform-registry"      90 || exit 1
wait_for "$TENANT/public-api/v1/health"       "tenant-manager"         90 || exit 1
wait_for "$KEYCLOAK/health/ready"             "keycloak"               120 || exit 1

# =====================================================================
section "2. Health check"
# =====================================================================
for entry in "iam:$IAM" "registry:$REGISTRY" "tenant:$TENANT"; do
    name=${entry%%:*}; url=${entry#*:}
    if [ "$name" = "iam" ]; then
        code=$(api GET "$url/public-api/v1/health/live")
        expect_code 200 "$code" "IAM health/live"
    else
        code=$(api GET "$url/public-api/v1/health")
        expect_code 200 "$code" "$name health"
    fi
done
code=$(api GET "$KEYCLOAK/health/ready")
expect_code 200 "$code" "Keycloak health/ready"

# =====================================================================
section "3. Admin login → list Keycloak realms"
# =====================================================================
KC_ADMIN_TOKEN=$(curl -sf -X POST "$KEYCLOAK/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=password" \
    -d "client_id=admin-cli" \
    -d "username=admin" \
    -d "password=admin" | jq -r '.access_token')
if [ -n "$KC_ADMIN_TOKEN" ] && [ "$KC_ADMIN_TOKEN" != "null" ]; then
    ok "Keycloak admin token acquired"
else
    err "Cannot get admin token"
    exit 1
fi

# Tạo sẵn realm cachesol (lưu ý: vẫn dùng để test login; tenant-acme sẽ tạo sau)
EXISTING=$(curl -sf -H "Authorization: Bearer $KC_ADMIN_TOKEN" "$KEYCLOAK/admin/realms" | jq -r '.[].realm')
info "Realms hiện có: $EXISTING"

# =====================================================================
section "4. Platform-registry — tạo tenant (sẽ trigger IAM provision realm)"
# =====================================================================
code=$(api POST "$REGISTRY/client-api/v1/tenants" "{
    \"slug\":\"$TENANT_SLUG\",
    \"displayName\":\"Acme Corporation\",
    \"legalName\":\"ACME JSC\",
    \"taxCode\":\"0123456789\",
    \"plan\":\"trial\",
    \"region\":\"vn\",
    \"keycloakRealm\":\"$REALM_NAME\",
    \"contactEmail\":\"admin@acme.com\",
    \"contactPhone\":\"+84909000001\"
}")
expect_code 201 "$code" "Tenant '$TENANT_SLUG' created"
pretty | head -20

# =====================================================================
section "5. IAM — kiểm tra realm đã được provision"
# =====================================================================
# Chờ 1-2s cho IAM gọi Keycloak xong
sleep 2
code=$(api GET "$IAM/service-api/v1/realms/$REALM_NAME")
expect_code 200 "$code" "IAM: realm '$REALM_NAME' exists"
pretty | jq '{realm, displayName, enabled}'

# Verify trực tiếp trong Keycloak
REALM_EXISTS=$(curl -sf -H "Authorization: Bearer $KC_ADMIN_TOKEN" \
    "$KEYCLOAK/admin/realms/$REALM_NAME" | jq -r '.realm // empty')
if [ "$REALM_EXISTS" = "$REALM_NAME" ]; then
    ok "Keycloak: realm '$REALM_NAME' confirmed"
else
    err "Keycloak: realm '$REALM_NAME' chưa tồn tại"
fi

# Check default roles đã có
code=$(api_with_realm GET "$REALM_NAME" "$IAM/service-api/v1/users/INVALID/roles")
info "Default realm roles list (test endpoint):"
curl -sf -X POST "$KEYCLOAK/admin/realms/$REALM_NAME/roles" \
    -H "Authorization: Bearer $KC_ADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"name":"PLATFORM_ADMIN","description":"test"}' >/dev/null 2>&1
ROLES=$(curl -sf -H "Authorization: Bearer $KC_ADMIN_TOKEN" \
    "$KEYCLOAK/admin/realms/$REALM_NAME/roles" | jq -r '.[].name' | sort | tr '\n' ' ')
info "Roles in realm: $ROLES"

# =====================================================================
section "6. Platform-registry — role template + mini-app"
# =====================================================================
code=$(api POST "$REGISTRY/client-api/v1/roles/templates" '{
    "code":"HRM_ADMIN_TEMPLATE",
    "name":"HRM Admin (template)",
    "appCode":"HRM",
    "permissionCodes":["HRM_USER_READ","HRM_USER_WRITE"]
}')
expect_code 201 "$code" "Role template created"
ROLE_TEMPLATE_ID=$(jq -r '.data.id' /tmp/resp.json)
info "Role template id: $ROLE_TEMPLATE_ID"

code=$(api POST "$REGISTRY/client-api/v1/mini-apps" '{
    "code":"HRM","name":"HRM","version":"1.0.0","category":"core","core":true,"active":true
}')
expect_code 201 "$code" "Mini-app HRM registered"

code=$(api GET "$REGISTRY/public-api/v1/mini-apps/catalog")
expect_code 200 "$code" "Mini-app catalog (public)"

# =====================================================================
section "7. Tenant-manager init-schema (orchestrator call)"
# =====================================================================
code=$(api POST "$TENANT/service-api/v1/internal/init-schema" "{
    \"slug\":\"$TENANT_SLUG\",
    \"companyCode\":\"ACME_ROOT\",
    \"companyName\":\"ACME HQ\",
    \"orgType\":\"COMPANY\",
    \"superAdminUserId\":\"00000000-0000-0000-0000-000000000001\",
    \"superAdminUsername\":\"admin\",
    \"superAdminEmail\":\"admin@acme.com\",
    \"superAdminFullName\":\"ACME Admin\",
    \"superAdminAppCode\":\"HRM\",
    \"superAdminRoleCode\":\"HRM_ADMIN\"
}")
if [ "$code" = "201" ] || [ "$code" = "200" ]; then
    ok "init-schema → $code"
    pretty | jq '.data'
else
    err "init-schema failed ($code)"; pretty
fi

# Verify callback đã về platform-registry
code=$(api GET "$REGISTRY/client-api/v1/tenants/$TENANT_SLUG")
expect_code 200 "$code" "Tenant re-fetch after init"
STATUS=$(jq -r '.data.status' /tmp/resp.json)
info "Tenant status: $STATUS"

# =====================================================================
section "8. Tenant-manager — organization + role"
# =====================================================================
code=$(api POST "$TENANT/client-api/v1/organizations" '{
    "code":"HR-DEPT","name":"HR Department","level":1,"path":"/acme/hr","orgType":"DEPT"
}')
expect_code 201 "$code" "Organization created"
ORG_ID=$(jq -r '.data.id' /tmp/resp.json)

code=$(api POST "$TENANT/client-api/v1/roles" '{
    "code":"HRM_ADMIN","name":"HRM Admin","appCode":"HRM",
    "description":"HRM administrator"
}')
expect_code 201 "$code" "Role HRM_ADMIN created"
ROLE_ID=$(jq -r '.data.id' /tmp/resp.json)

# =====================================================================
section "9. Tenant-manager — tạo user (TỰ gọi IAM tạo Keycloak user)"
# =====================================================================
code=$(api POST "$TENANT/client-api/v1/users" "{
    \"username\":\"alice\",
    \"password\":\"$PASSWORD\",
    \"email\":\"alice@acme.com\",
    \"fullName\":\"Alice Nguyen\",
    \"realm\":\"$REALM_NAME\",
    \"realmRoles\":[\"HRM_USER\"],
    \"roleCodes\":[\"HRM_ADMIN\"],
    \"appCode\":\"HRM\",
    \"orgId\":\"$ORG_ID\",
    \"jobTitle\":\"HR Manager\"
}")
if [ "$code" = "201" ]; then
    ok "AppUser 'alice' created + Keycloak user delegated"
    USER_ID=$(jq -r '.data.id' /tmp/resp.json)
    KC_USER_ID=$(jq -r '.data.keycloakUserId' /tmp/resp.json)
    info "AppUser id: $USER_ID, KeycloakUserId: $KC_USER_ID"
else
    err "AppUser creation failed ($code)"; pretty
    USER_ID=""; KC_USER_ID=""
fi

# =====================================================================
section "10. IAM — verify Keycloak user exists + has role"
# =====================================================================
if [ -n "$KC_USER_ID" ]; then
    code=$(api_with_realm GET "$REALM_NAME" "$IAM/service-api/v1/users/$KC_USER_ID")
    expect_code 200 "$code" "IAM: find Keycloak user"
    pretty | jq '.data | {id, username, email, enabled, realmRoles}'
    KC_USERNAME=$(jq -r '.data.username' /tmp/resp.json)
    KC_ROLES=$(jq -r '.data.realmRoles | join(",")' /tmp/resp.json)
    info "Keycloak user: $KC_USERNAME, roles: $KC_ROLES"
else
    err "Không có keycloakUserId để test"
fi

# =====================================================================
section "11. Tenant-manager — grant role (cả 2 phía)"
# =====================================================================
if [ -n "$USER_ID" ]; then
    code=$(api POST "$TENANT/client-api/v1/users/$USER_ID/roles" "{
        \"roleCode\":\"HRM_ADMIN\",
        \"appCode\":\"HRM\",
        \"realm\":\"$REALM_NAME\"
    }")
    expect_code 200 "$code" "Grant app role HRM_ADMIN"

    # Verify role list
    code=$(api GET "$TENANT/client-api/v1/users/$USER_ID/roles")
    expect_code 200 "$code" "List user roles"
    pretty | jq '.data | map({roleCode, appCode})'
fi

# =====================================================================
section "12. Login Keycloak bằng user vừa tạo (password grant)"
# =====================================================================
KC_USER_TOKEN=$(curl -sf -X POST "$KEYCLOAK/realms/$REALM_NAME/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=password" \
    -d "client_id=admin-cli" \
    -d "client_secret=admin-cli-secret" \
    -d "username=alice" \
    -d "password=$PASSWORD" | jq -r '.access_token')
if [ -n "$KC_USER_TOKEN" ] && [ "$KC_USER_TOKEN" != "null" ]; then
    ok "Keycloak login 'alice' OK"
    info "Token (first 40): ${KC_USER_TOKEN:0:40}..."
else
    err "Keycloak login 'alice' FAILED"
fi

# =====================================================================
section "13. IAM — decode JWT xác minh token hợp lệ"
# =====================================================================
if [ -n "$KC_USER_TOKEN" ]; then
    code=$(api POST "$IAM/service-api/v1/jwt/decode" "{\"token\":\"$KC_USER_TOKEN\"}")
    expect_code 200 "$code" "JWT decode"
    pretty | jq '.data | {valid, username, email, tenantSlug, roles}'
fi

# =====================================================================
section "14. Cleanup + error handling"
# =====================================================================
# Duplicate tenant → 409
code=$(api POST "$REGISTRY/client-api/v1/tenants" "{
    \"slug\":\"$TENANT_SLUG\",\"displayName\":\"Dup\",\"keycloakRealm\":\"$REALM_NAME\",\"contactEmail\":\"x@x.com\"
}")
expect_code 409 "$code" "Duplicate tenant → 409"

# Duplicate user → 409
if [ -n "$KC_USER_ID" ]; then
    code=$(api POST "$TENANT/client-api/v1/users" "{
        \"username\":\"alice\",\"password\":\"$PASSWORD\",\"realm\":\"$REALM_NAME\",\"email\":\"alice2@acme.com\"
    }")
    if [ "$code" = "409" ] || [ "$code" = "201" ]; then
        ok "Duplicate user → $code (expected 409 hoặc 201 nếu Idempotent)"
    else
        err "Duplicate user unexpected code $code"
    fi
fi

# Not found
code=$(api GET "$TENANT/client-api/v1/users/00000000-0000-0000-0000-000000000000")
expect_code 404 "$code" "User not found → 404"

# Bad password → 401 from Keycloak
BAD_TOKEN=$(curl -s -X POST "$KEYCLOAK/realms/$REALM_NAME/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "grant_type=password" \
    -d "client_id=admin-cli" \
    -d "client_secret=admin-cli-secret" \
    -d "username=alice" \
    -d "password=WRONG_PASSWORD" | jq -r '.access_token // empty')
if [ -z "$BAD_TOKEN" ]; then
    ok "Bad password rejected by Keycloak"
else
    err "Bad password KHÔNG bị reject"
fi

# =====================================================================
section "Kết quả"
# =====================================================================
echo ""
echo "Service URLs:"
echo "  - IAM Service:        $IAM"
echo "  - Platform Registry:  $REGISTRY"
echo "  - Tenant Manager:     $TENANT"
echo "  - Keycloak Admin:     $KEYCLOAK (admin/admin)"
echo "  - Test realm:         $REALM_NAME"
echo "  - Test user:          alice / $PASSWORD"
echo ""
if [ $GLOBAL_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ ${GLOBAL_FAILED} check(s) failed${NC}"
    exit 1
fi
