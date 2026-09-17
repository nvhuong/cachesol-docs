#!/bin/bash
# =====================================================
# Init PostgreSQL: enable extensions + create per-service schemas
# =====================================================
set -e

echo "⏳ Đợi PostgreSQL ready..."
for i in {1..30}; do
  if pg_isready -h postgres -p 5432 -U postgres > /dev/null 2>&1; then
    echo "✓ Postgres ready"
    break
  fi
  sleep 2
done

echo "→ Enable pgcrypto extension..."
PGPASSWORD=postgres psql -h postgres -U postgres -d cachesol_platform \
    -c 'CREATE EXTENSION IF NOT EXISTS "pgcrypto";' \
    && echo "✓ pgcrypto enabled"

echo "→ Create tenant_manager schema (nếu chưa có)..."
PGPASSWORD=postgres psql -h postgres -U postgres -d cachesol_platform \
    -c 'CREATE SCHEMA IF NOT EXISTS tenant_manager;' \
    && echo "✓ tenant_manager schema created"

echo "→ Create platform_registry schema (nếu chưa có)..."
PGPASSWORD=postgres psql -h postgres -U postgres -d cachesol_platform \
    -c 'CREATE SCHEMA IF NOT EXISTS platform_registry;' \
    && echo "✓ platform_registry schema created"

echo "✅ Postgres init done."
