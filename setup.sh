#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# Cleaning Products E-commerce CMS Template — Setup Script
# ─────────────────────────────────────────────────────────────────
set -e

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Cleaning Products E-commerce CMS Template Setup       ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ─── Option: create a new Strapi project ────────────────────────
# Uncomment to scaffold a fresh Strapi instance into backend/strapi
# npx create-strapi-app@latest backend/strapi \
#   --dbclient=sqlite \
#   --dbfilename=.tmp/data.db \
#   --no-run

# ─── Backend ────────────────────────────────────────────────────
echo "📦 Installing backend dependencies..."
cd backend/strapi
cp -n .env.example .env || true
npm install
echo "✅ Backend ready."
echo ""
echo "   Start CMS:  cd backend/strapi && npm run develop"
echo "   Admin:      http://localhost:1337/admin"
echo ""

# ─── Frontend ────────────────────────────────────────────────────
echo "📦 Installing frontend dependencies..."
cd ../../frontend
cp -n .env.example .env.local || true
npm install
echo "✅ Frontend ready."
echo ""
echo "   Start app:  cd frontend && npm run dev"
echo "   Site:       http://localhost:3000"
echo ""

# ─── Seed ───────────────────────────────────────────────────────
echo "ℹ️  To seed demo data after starting Strapi and creating an API token:"
echo "   cd backend/strapi"
echo "   STRAPI_TOKEN=<your-token> node seeds/seed-data.js"
echo ""

echo "🎉 Setup complete!"
