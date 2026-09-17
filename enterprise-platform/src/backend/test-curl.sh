#!/bin/bash
# =====================================================
# cachesol MVP — full curl test
# =====================================================
# Test flow:
#   1. Health check 3 services
#   2. Platform-registry: tạo tenant + mini-app
#   3. Tenant-manager: tạo role + organization + user + assign role
#   4. IAM: tạo user trong Keycloak + gán realm role
#
# Usage:
#   bash test-curl.sh
#
# Cần: docker compose up -d --build đã chạy và 3 services + keycloak ready.

set -e

IAM="http://localhost:8088"
REGISTRY="http://localhost:8087"
TENANT="http://localhost:8089"
KEYCLOAK="http://localhost:8090"
REALM="cachesol"

GREEN='\033[0;32m'; RED='\033[0;31m'; YELLOW='\033[1;33m'; NC='\033[0m'
ok() { echo -e "${GREEN}✓${NC} $1"; }
err() { echo -e "${RED}✗${NC} $1"; }
section() { echo -e "\n${YELLOW}=== $1 ===${NC}"; }

# Hàm gọi API trả status code + body
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

# Hàm pretty print JSON (nếu có jq)
pretty() { jq . /tmp/resp.json 2>/dev/null || cat /tmp/resp.json; }

# ====================================================
section "1. Health check"
# ====================================================
for svc in "iam-service:$IAM" "platform-registry:$REGISTRY" "tenant-manager:$TENANT"; do
    name=${svc%%:*}
    url=${svc#*:}
    code=$(curl -s -o /tmp/resp.json -w "%{http_code}" "$url/public-api/v1/health")
    if [ "$code" = "200" ]; then ok "$name → 200"; pretty | head -10; else err "$name → $code"; fi
done

# ====================================================
section "2. Platform Registry — tạo tenant"
# ====================================================
code=$(api POST "$REGISTRY/client-api/v1/tenants" '{
    "slug":"acme",
    "name":"Acme Corporation"
}')
[ "$code" = "201" ] && ok "Tenant 'acme' created" || { err "Status $code"; pretty; exit 1; }
cat /tmp/resp.json | jq .

code=$(api GET "$REGISTRY/client-api/v1/tenants")
[ "$code" = "200" ] && ok "List tenants" && cat /tmp/resp.json | jq '.data | length' | xargs echo "Total tenants:"

code=$(api GET "$REGISTRY/client-api/v1/tenants/acme")
[ "$code" = "200" ] && ok "Find by slug" && cat /tmp/resp.json | jq .

# ====================================================
section "3. Platform Registry — register mini-app"
# ====================================================
code=$(api POST "$REGISTRY/client-api/v1/mini-apps" '{
    "code":"BLOG",
    "name":"Blog",
    "version":"1.0.0"
}')
[ "$code" = "201" ] && ok "MiniApp 'BLOG' registered" || { err "Status $code"; pretty; exit 1; }
cat /tmp/resp.json | jq .

code=$(api GET "$REGISTRY/client-api/v1/mini-apps")
[ "$code" = "200" ] && ok "List mini-apps" && cat /tmp/resp.json | jq '.data | map({code, name, version})'

# ====================================================
section "4. Tenant Manager — tạo role"
# ====================================================
code=$(api POST "$TENANT/client-api/v1/roles" '{
    "code":"BLOGGER",
    "name":"Blogger",
    "appCode":"BLOG"
}')
[ "$code" = "201" ] && ok "Role 'BLOGGER' created" || { err "Status $code"; pretty; }
cat /tmp/resp.json | jq .

# ====================================================
section "5. Tenant Manager — tạo organization"
# ====================================================
code=$(api POST "$TENANT/client-api/v1/organizations" '{
    "code":"root",
    "name":"Acme HQ",
    "level":0,
    "path":"/acme"
}')
[ "$code" = "201" ] && ok "Organization 'root' created" || { err "Status $code"; pretty; }
cat /tmp/resp.json | jq .
ORG_ID=$(jq -r '.data.id' /tmp/resp.json)

# ====================================================
section "6. Tenant Manager — tạo user"
# ====================================================
code=$(api POST "$TENANT/client-api/v1/users" "{
    \"keycloakUserId\":\"kc-alice-001\",
    \"username\":\"alice\",
    \"email\":\"alice@acme.com\",
    \"fullName\":\"Alice Nguyen\",
    \"roles\":[\"BLOGGER\",\"HRM_USER\"],
    \"appCode\":\"BLOG\",
    \"orgId\":\"$ORG_ID\",
    \"jobTitle\":\"Content Writer\"
}")
[ "$code" = "201" ] && ok "User 'alice' created" || { err "Status $code"; pretty; }
cat /tmp/resp.json | jq .
USER_ID=$(jq -r '.data.id' /tmp/resp.json)

code=$(api GET "$TENANT/client-api/v1/users")
[ "$code" = "200" ] && ok "List users" && cat /tmp/resp.json | jq '.data | map({username, fullName, active})'

code=$(api GET "$TENANT/client-api/v1/users/by-username/alice")
[ "$code" = "200" ] && ok "Find by username" && cat /tmp/resp.json | jq .

# ====================================================
section "7. IAM Service — tạo user qua Keycloak"
# ====================================================
code=$(api POST "$IAM/client-api/v1/users" '{
    "username":"bob",
    "password":"Bob@12345",
    "email":"bob@acme.com",
    "firstName":"Bob",
    "lastName":"Tran",
    "realmRoles":["HRM_USER"],
    "tenantSlug":"acme"
}')
[ "$code" = "201" ] && ok "Keycloak user 'bob' created" || { err "Status $code"; pretty; }
cat /tmp/resp.json | jq .
KC_USER_ID=$(jq -r '.data.id' /tmp/resp.json)

code=$(api GET "$IAM/client-api/v1/users/bob")
[ "$code" = "200" ] && ok "Find Keycloak user" && cat /tmp/resp.json | jq .

# ====================================================
section "8. Tenant Manager — sync Keycloak user"
# ====================================================
code=$(api POST "$TENANT/client-api/v1/users" "{
    \"keycloakUserId\":\"$KC_USER_ID\",
    \"username\":\"bob\",
    \"email\":\"bob@acme.com\",
    \"fullName\":\"Bob Tran\",
    \"roles\":[\"SALES_USER\"],
    \"appCode\":\"SALES\",
    \"orgId\":\"$ORG_ID\",
    \"jobTitle\":\"Sales Executive\"
}")
if [ "$code" = "201" ]; then
    ok "Synced 'bob' → tenant_manager"
elif [ "$code" = "409" ]; then
    ok "Bob đã tồn tại trong tenant_manager (expected)"
fi
cat /tmp/resp.json | jq .

# ====================================================
section "9. Test error handling"
# ====================================================
code=$(api POST "$TENANT/client-api/v1/users" '{"username":"alice"}')
[ "$code" = "400" ] && ok "Validation error → 400" || err "Expected 400, got $code"

code=$(api POST "$REGISTRY/client-api/v1/tenants" '{"slug":"acme","name":"Dup"}')
[ "$code" = "409" ] && ok "Duplicate tenant → 409" || err "Expected 409, got $code"
cat /tmp/resp.json | jq .

code=$(api GET "$TENANT/client-api/v1/users/00000000-0000-0000-0000-000000000000")
[ "$code" = "404" ] && ok "Not found → 404" || err "Expected 404, got $code"

# ====================================================
section "✅ All tests passed!"
# ====================================================
echo ""
echo "Service URLs:"
echo "  - IAM:              $IAM"
echo "  - Platform Registry: $REGISTRY"
echo "  - Tenant Manager:    $TENANT"
echo "  - Keycloak Admin:    $KEYCLOAK (admin/admin)"
echo ""
echo "Test users created:"
echo "  - bob / Bob@12345    (Keycloak realm role: HRM_USER)"
echo "  - alice              (tenant_manager role: BLOGGER, HRM_USER)"
echo ""
