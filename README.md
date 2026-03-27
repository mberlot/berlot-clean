# Cleaning Products E-commerce CMS Template

A production-ready, reusable e-commerce template for cleaning product distributors and retailers.

**Demo brand:** Berlot Clean
**Stack:** Next.js + TypeScript + Tailwind CSS + Strapi CMS

---

## Architecture Overview

```
berlot-clean/
├── backend/
│   └── strapi/               # Headless CMS (Strapi v4)
│       ├── content-types/    # Data model schemas
│       ├── components/       # Reusable field components
│       ├── config/           # Strapi configuration
│       ├── middlewares/      # Custom middlewares
│       └── seeds/            # Demo data
│
└── frontend/                 # Next.js 14 App Router
    ├── app/                  # Pages (SSR/ISR)
    ├── components/           # UI components
    ├── features/             # Feature slices (cart, search)
    ├── services/             # API client layer
    ├── hooks/                # Custom React hooks
    ├── types/                # TypeScript types
    └── lib/                  # Utilities, SEO helpers
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <repo-url>
cd berlot-clean
```

### 2. Backend (Strapi)

```bash
cd backend/strapi
cp .env.example .env
npm install
npm run develop
# Admin panel: http://localhost:1337/admin
```

### 3. Frontend (Next.js)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
# Site: http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/strapi/.env`)

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-salt
ADMIN_JWT_SECRET=your-jwt-secret
TRANSFER_TOKEN_SALT=your-token-salt
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

### Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_TOKEN=your-api-token
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Your Brand Name
```

---

## Content Types

| Type | Description |
|------|-------------|
| Product | Full product with pricing, images, SEO |
| Category | Hierarchical categories |
| Brand | Supplier/brand profiles |
| Promotion | Time-limited banners/offers |
| Page | Static CMS pages |
| HomeSection | Configurable homepage blocks |

---

## Customization

To adapt this template to a new client:

1. Update `NEXT_PUBLIC_SITE_NAME` in `.env.local`
2. Replace logo in `frontend/public/logo.svg`
3. Update color palette in `tailwind.config.ts` (`colors.brand`)
4. Import client's product catalog via Strapi admin or seed script
5. Configure promotions and home sections in Strapi admin

---

## Features

- Product catalog with category/brand/tag filtering
- Full-text search
- ISR product and category pages (revalidate every 60s)
- Cart (localStorage-backed context)
- SEO: dynamic meta, OpenGraph, JSON-LD structured data
- Sitemap generation
- Image optimization via `next/image`
- Responsive mobile-first UI
- Promotions with date-range scheduling

---

## License

MIT — free to use for client projects.
