#!/bin/bash
set -euo pipefail

# ══════════════════════════════════════════════════════════════
# Initialize both production and dev databases
# Run from the project root after docker-compose.prod.yml is up
# ══════════════════════════════════════════════════════════════

echo "Waiting for databases to be ready..."
sleep 5

echo "═══ Migrating PRODUCTION database ═══"
DATABASE_URL="postgresql://hvac_user:${DB_PROD_PASSWORD}@localhost:5432/hvac_prod" \
  npx prisma migrate deploy

echo "═══ Seeding PRODUCTION database ═══"
DATABASE_URL="postgresql://hvac_user:${DB_PROD_PASSWORD}@localhost:5432/hvac_prod" \
  npx tsx prisma/seed.ts

echo "═══ Migrating DEVELOPMENT database ═══"
DATABASE_URL="postgresql://hvac_user:${DB_DEV_PASSWORD}@localhost:5433/hvac_dev" \
  npx prisma migrate deploy

echo "═══ Seeding DEVELOPMENT database ═══"
DATABASE_URL="postgresql://hvac_user:${DB_DEV_PASSWORD}@localhost:5433/hvac_dev" \
  npx tsx prisma/seed.ts

echo ""
echo "Both databases initialized successfully!"
echo "  Prod: admin@comfortairpro.com / admin123456"
echo "  Dev:  admin@comfortairpro.com / admin123456"
echo "  Both: demo@example.com / customer123456"
