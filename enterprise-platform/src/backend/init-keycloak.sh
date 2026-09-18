#!/bin/bash
# =====================================================
# Init Keycloak realm + admin client cho cachesol
# =====================================================
set -e

KC_URL=${KEYCLOAK_URL:-http://keycloak:8080}
ADMIN_USER=${KEYCLOAK_ADMIN_USER:-admin}
ADMIN_PASSWORD=${KEYCLOAK_ADMIN_PASSWORD:-admin}
REALM=${KEYCLOAK_REALM:-cachesol}

echo "⏳ Đợi Keycloak sẵn sàng..."
for i in {1..30}; do
  if curl -sf "${KC_URL}/health/ready" > /dev/null; then
    echo "✓ Keycloak ready"
    break
  fi
  sleep 3
done

# Lấy admin token
TOKEN=$(curl -sf -X POST "${KC_URL}/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=${ADMIN_USER}" \
  -d "password=${ADMIN_PASSWORD}" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r '.access_token')

if [ -z "$TOKEN" ]; then
  echo "✗ Không lấy được admin token"
  exit 1
fi
echo "✓ Admin token OK"

# Tạo realm nếu chưa có
# LƯU Ý: Để gán `loginTheme` cho realm (theme login riêng cho từng tenant),
# thêm field `"loginTheme": "<theme-name>"` vào body dưới đây.
# Theme phải tồn tại trong Keycloak (mount ./keycloak/themes:/opt/keycloak/themes:ro
# trong docker-compose.mvp.yml) trước khi realm start.
# MVP: chưa có custom theme — Keycloak dùng default theme.
echo "→ Tạo realm '${REALM}' (nếu chưa có)..."
curl -sf -X POST "${KC_URL}/admin/realms" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "realm": "'"${REALM}"'",
    "enabled": true,
    "registrationAllowed": true,
    "loginWithEmailAllowed": true,
    "duplicateEmailsAllowed": false,
    "verifyEmail": false,
    "resetPasswordAllowed": true,
    "editUsernameAllowed": true,
    "bruteForceProtected": true
  }' && echo "✓ Realm created" || echo "ℹ Realm exists"

# Tạo admin-cli client trong realm
echo "→ Tạo client 'admin-cli'..."
curl -sf -X POST "${KC_URL}/admin/realms/${REALM}/clients" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "admin-cli",
    "enabled": true,
    "publicClient": false,
    "secret": "admin-cli-secret",
    "directAccessGrantsEnabled": true,
    "serviceAccountsEnabled": true,
    "standardFlowEnabled": true
  }' && echo "✓ Client created" || echo "ℹ Client exists"

# Tạo realm roles mặc định
for ROLE in PLATFORM_ADMIN TENANT_ADMIN HRM_ADMIN HRM_USER SALES_USER; do
  curl -sf -X POST "${KC_URL}/admin/realms/${REALM}/roles" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{"name": "'"${ROLE}"'", "description": "Role '"${ROLE}"'"}' \
    > /dev/null && echo "✓ Role ${ROLE}" || echo "ℹ Role ${ROLE} exists"
done

echo "✅ Keycloak init done."
