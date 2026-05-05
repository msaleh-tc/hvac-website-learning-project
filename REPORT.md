# ComfortAir Pro — Full Development & Deployment Report

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Rationale](#2-tech-stack--rationale)
3. [Project Initialization (Step-by-Step)](#3-project-initialization-step-by-step)
4. [Architecture & Code Structure](#4-architecture--code-structure)
5. [Database Design](#5-database-design)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Event Logging & Analytics](#7-event-logging--analytics)
8. [CI/CD Pipeline](#8-cicd-pipeline)
9. [Production Deployment Guide](#9-production-deployment-guide)
10. [Domain & DNS Setup](#10-domain--dns-setup)
11. [Environment Variables & Secrets Management](#11-environment-variables--secrets-management)
12. [Security Best Practices Implemented](#12-security-best-practices-implemented)
13. [Monitoring & Debugging](#13-monitoring--debugging)
14. [Release Management](#14-release-management)
15. [Development Workflow Commands](#15-development-workflow-commands)
16. [Cost Summary (All Free Tier)](#16-cost-summary-all-free-tier)

---

## 1. Project Overview

**ComfortAir Pro** is a production-ready website for a residential and commercial HVAC (Heating, Ventilation, and Air Conditioning) maintenance company. It includes:

- **Public website**: Home, Services, About, Contact, Service Booking
- **Customer portal**: Dashboard, service request tracking, profile management
- **Admin panel**: Request management, customer list, contact messages, analytics
- **Backend API**: RESTful endpoints for all CRUD operations
- **Event logging**: Privacy-respecting user experience tracking
- **Auth system**: Role-based access (Customer, Technician, Admin)

**GitHub Repository**: https://github.com/msaleh-tc/hvac-website-learning-project

---

## 2. Tech Stack & Rationale

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 (App Router) | Full-stack React framework with SSR, API routes, built-in optimization |
| **Language** | TypeScript 5 | Type safety, better DX, fewer runtime errors |
| **Styling** | Tailwind CSS 4 | Utility-first, fast iteration, zero CSS files to manage |
| **Database** | PostgreSQL (via Neon) | Production-grade relational DB, free tier available |
| **ORM** | Prisma 6 | Type-safe database queries, auto-generated types, migrations |
| **Auth** | NextAuth.js 4 | Battle-tested auth for Next.js, JWT strategy with credentials provider |
| **Validation** | Zod 4 | Runtime type validation, integrates with react-hook-form |
| **Forms** | react-hook-form 7 | Performant forms with minimal re-renders |
| **Icons** | lucide-react | Modern, tree-shakeable SVG icons |
| **Hosting** | Vercel | Native Next.js hosting, free tier, automatic deployments |
| **CI/CD** | GitHub Actions | Free for public repos, native GitHub integration |
| **Containerization** | Docker | Consistent environments, portable deployment |

---

## 3. Project Initialization (Step-by-Step)

### 3.1 Create Next.js Project

```bash
# Create the project with TypeScript, Tailwind, ESLint, App Router
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**Flags explained:**
- `--typescript`: Enables TypeScript support
- `--tailwind`: Pre-configures Tailwind CSS
- `--eslint`: Adds ESLint for code linting
- `--app`: Uses the new App Router (not Pages Router)
- `--src-dir`: Puts source code under `src/` directory
- `--import-alias "@/*"`: Sets up `@/` as alias for `src/`
- `--use-npm`: Uses npm as package manager

### 3.2 Install Dependencies

```bash
# Core dependencies
npm install prisma @prisma/client next-auth \
  bcryptjs uuid zod react-hook-form @hookform/resolvers \
  date-fns lucide-react clsx tailwind-merge dotenv

# Dev dependencies (type definitions)
npm install -D @types/bcryptjs @types/uuid prisma
```

**What each package does:**
- `prisma` / `@prisma/client`: Database ORM and client (generator: `prisma-client-js`, imported from `@prisma/client`)
- `next-auth`: Authentication with JWT session strategy (no PrismaAdapter — it conflicts with credentials provider)
- `bcryptjs`: Password hashing (12 rounds of salted hashing)
- `dotenv`: Environment variable loading (used in `prisma.config.ts` and seed script)
- `uuid`: Unique ID generation
- `zod`: Schema validation for API inputs and forms
- `react-hook-form` / `@hookform/resolvers`: Form state management with Zod integration
- `date-fns`: Date formatting utilities
- `lucide-react`: Icon library
- `clsx` / `tailwind-merge`: Tailwind CSS class merging utilities

### 3.3 Initialize Prisma

```bash
npx prisma init
```

This creates:
- `prisma/schema.prisma` — Database schema definition
- `prisma.config.ts` — Prisma configuration (uses `engine: "classic"` and `import "dotenv/config"` for env loading)
- `.env` — Environment variables template

**Note:** The `postinstall` script in `package.json` runs `prisma generate` automatically on every `npm install`, so the Prisma client is always up to date.

### 3.4 Initialize Git & GitHub

```bash
# Git was auto-initialized by create-next-app
# Create remote repository
gh repo create comfortair-pro --public --description "ComfortAir Pro - HVAC Services Website"

# Connect and push
git remote add origin https://github.com/msaleh-tc/hvac-website-learning-project.git
git add -A
git commit -m "Initial release: ComfortAir Pro HVAC website"
git push -u origin main
```

### 3.5 Set Up Branch Protection

Branch protection is enabled on the `main` branch, requiring the following status checks to pass:
- **Lint & Type Check**
- **Build**

```bash
gh api repos/msaleh-tc/hvac-website-learning-project/branches/main/protection -X PUT --input - <<'EOF'
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["Lint & Type Check", "Build"]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": null,
  "restrictions": null
}
EOF
```

---

## 4. Architecture & Code Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Route group: public pages (no URL prefix)
│   │   ├── layout.tsx            # Header + Footer wrapper
│   │   ├── page.tsx              # Home page (/)
│   │   ├── services/page.tsx     # Services page
│   │   ├── about/page.tsx        # About page
│   │   ├── contact/page.tsx      # Contact form
│   │   └── book/page.tsx         # Service booking form
│   ├── auth/                     # Authentication pages
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   └── signout/page.tsx
│   ├── dashboard/                # Customer portal (auth required)
│   │   ├── layout.tsx            # Dashboard sidebar layout
│   │   ├── page.tsx              # Dashboard overview
│   │   ├── requests/page.tsx     # Service request list
│   │   └── profile/page.tsx      # Profile management
│   ├── admin/                    # Admin panel (ADMIN role required)
│   │   ├── layout.tsx            # Admin sidebar layout
│   │   ├── page.tsx              # Admin overview
│   │   ├── requests/             # Request management
│   │   ├── customers/            # Customer list
│   │   ├── messages/             # Contact messages
│   │   └── analytics/            # Analytics dashboard
│   ├── api/                      # API routes
│   │   ├── auth/[...nextauth]/   # NextAuth.js handler
│   │   ├── auth/signup/          # Registration endpoint
│   │   ├── auth/profile/         # Profile update endpoint
│   │   ├── contact/              # Contact form submission
│   │   ├── service-requests/     # Service request CRUD
│   │   ├── events/               # Analytics event ingestion
│   │   └── admin/                # Admin-only endpoints
│   ├── layout.tsx                # Root layout (fonts, metadata, providers)
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── textarea.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   └── card.tsx
│   └── layout/                   # Layout components
│       ├── header.tsx            # Navigation bar
│       ├── footer.tsx            # Site footer
│       └── providers.tsx         # Session provider wrapper
├── lib/                          # Shared utilities
│   ├── prisma.ts                 # Prisma client singleton
│   ├── auth.ts                   # NextAuth.js configuration
│   ├── events.ts                 # Event logging utility
│   ├── validations.ts            # Zod schemas
│   └── utils.ts                  # Helper functions
├── middleware.ts                  # Auth middleware (route protection)
└── types/
    └── next-auth.d.ts            # NextAuth type extensions
```

**Key architectural decisions:**
- **Route groups** `(public)` to share Header/Footer layout without affecting URLs
- **Server components by default** — only use `"use client"` when hooks/interactivity needed
- **Server-side data fetching** in dashboard/admin pages via Prisma (no API calls from server components)
- **API routes** for client-side mutations (forms, auth)
- **Middleware** for route protection instead of per-page auth checks

---

## 5. Database Design

### Schema (prisma/schema.prisma)

**Generator:** Uses `prisma-client-js` with `binaryTargets = ["native", "rhel-openssl-3.0.x"]`. The `rhel-openssl-3.0.x` target is required for Vercel's serverless runtime (Amazon Linux). The Prisma client is imported from `@prisma/client`.

**Models:**
- `User` — Users with roles (CUSTOMER, TECHNICIAN, ADMIN)
- `Account` / `Session` / `VerificationToken` — NextAuth.js standard tables
- `ServiceRequest` — HVAC service requests with full lifecycle
- `ContactMessage` — Contact form submissions
- `EventLog` — Privacy-respecting analytics events

**Enums:**
- `Role`: CUSTOMER, TECHNICIAN, ADMIN
- `ServiceType`: RESIDENTIAL, COMMERCIAL
- `ServiceCategory`: AC_REPAIR, HEATING_REPAIR, etc. (11 categories)
- `Priority`: LOW, NORMAL, HIGH, EMERGENCY
- `RequestStatus`: PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED

**Indexes** are defined on:
- User.email, User.role
- ServiceRequest.status, ServiceRequest.userId, ServiceRequest.createdAt
- EventLog.action, EventLog.category, EventLog.createdAt, EventLog.userId
- ContactMessage.read, ContactMessage.createdAt

### Database Commands

```bash
# Generate Prisma client (run after schema changes)
npx prisma generate

# Create and apply migrations (development)
npx prisma migrate dev --name init

# Push schema to database (quick sync, no migration file)
npx prisma db push

# Apply migrations in production
npx prisma migrate deploy

# Seed the database with demo data
npx tsx prisma/seed.ts

# Open Prisma Studio (visual database browser)
npx prisma studio
```

### Seed Data

The seed script (`prisma/seed.ts`) imports `dotenv/config` at the top for standalone execution and creates:
- **Admin user**: admin@comfortairpro.com / admin123456
- **Demo customer**: demo@example.com / customer123456
- **3 sample service requests** (various statuses)
- **2 sample contact messages**

These demo credentials work on both production and development environments.

---

## 6. Authentication & Authorization

### How It Works

1. **NextAuth.js** handles session management with **JWT strategy** (no database sessions)
2. **Credentials provider** for email/password authentication
3. **No PrismaAdapter** — it was removed because it conflicts with the credentials provider by trying to create database sessions instead of using JWT
4. **bcryptjs** hashes passwords with 12 rounds of salting
5. **JWT callbacks** inject user role into the session token
6. **Middleware** (`src/middleware.ts`) protects `/dashboard/*` and `/admin/*` routes
7. Admin routes check `role === "ADMIN"` at both middleware and page level

### Auth Flow

```
Sign Up → POST /api/auth/signup → validate → hash password → create user → auto sign in
Sign In → NextAuth credentials → verify password → issue JWT → set cookie
Protected Route → middleware checks JWT → redirect if missing
Admin Route → middleware + page-level role check → redirect if not ADMIN
```

---

## 7. Event Logging & Analytics

### Privacy-Respecting Design

- **IP addresses** are SHA-256 hashed with the app secret (cannot be reversed)
- **User agent** strings are truncated to 256 chars
- **No PII** stored in event metadata
- **Session IDs** are used for anonymous session tracking
- Events are stored in the `EventLog` table with indexes for efficient querying

### What Gets Logged

- User signups
- Profile updates
- Service request creation/updates
- Contact form submissions
- Admin actions (status changes, etc.)
- Page views (via client-side event API)

### Client-Side Event Tracking

```typescript
// Any page can send analytics events
fetch("/api/events", {
  method: "POST",
  body: JSON.stringify({
    action: "page_view",
    category: "navigation",
    page: "/services",
    metadata: { referrer: document.referrer }
  })
});
```

---

## 8. CI/CD Pipeline

### GitHub Actions Workflows

#### CI Workflow (`.github/workflows/ci.yml`)
Triggers on: push to `main`, pull requests to `main`

1. **Lint & Type Check** job:
   - Checkout code
   - Setup Node.js 20 with npm cache
   - Install dependencies (`npm ci`)
   - Generate Prisma client
   - Run ESLint (`npm run lint`)
   - Run TypeScript compiler (`npx tsc --noEmit`)

2. **Build** job (depends on lint passing):
   - Full Next.js production build
   - Uses dummy DATABASE_URL (build doesn't need real DB)

3. **Security Audit** job:
   - Runs `npm audit --audit-level=high`

#### Deploy Workflow (`.github/workflows/deploy.yml`)
Triggers on: git tags matching `v*` (e.g., `v1.0.0`)

1. Install and generate Prisma
2. Run database migrations against production DB
3. Deploy to Vercel using `amondnet/vercel-action`

---

## 9. Production Deployment Guide

### Vercel + Neon (Current Production Setup)

Both environments are **deployed and verified working**.

#### Neon PostgreSQL Database (Live)

- **Project**: square-union-44573497
- **Region**: ap-southeast-1 (Singapore)
- **Production branch**: `production`
- **Dev branch**: `dev` (branched from production)

Neon free tier includes:
- 0.5 GB storage
- 190 compute hours/month
- Autoscaling to zero when idle
- Automatic backups

#### Vercel Deployments (Live)

- **Vercel project**: `learning-project` under `16msaleh-9037s-projects`
- **Production**: https://learning-project-gules-mu.vercel.app
- **Development**: https://dev-learning-project.vercel.app (stable alias)

**Vercel SSO deployment protection** was disabled so the dev environment is publicly accessible.

Since there is no GitHub integration with Vercel (enterprise GitHub account), deployments are done via CLI:

```bash
# Production deployment (from main branch)
npx vercel deploy --prod

# Dev deployment (from develop branch)
npx vercel deploy
npx vercel alias <deployment-url> dev-learning-project.vercel.app
```

#### Environment Variables Set in Vercel

| Scope | Variables |
|-------|-----------|
| **Production** | `DATABASE_URL` (production Neon branch), `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |
| **Preview** | `DATABASE_URL` (dev Neon branch), `NEXTAUTH_SECRET`, `NEXTAUTH_URL` |

#### Database Migrations & Seeding (Done)

```bash
# Migrations were applied to production
DATABASE_URL="postgresql://..." npx prisma migrate deploy

# Both environments were seeded
DATABASE_URL="postgresql://..." npx tsx prisma/seed.ts
```

#### Demo Credentials (work on both environments)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@comfortairpro.com | admin123456 |
| Customer | demo@example.com | customer123456 |

### Option B: Railway (Alternative — Free Tier)

1. Go to https://railway.app and sign up
2. Create new project → Deploy from GitHub repo
3. Add PostgreSQL plugin (built-in, free tier)
4. Railway auto-detects Next.js and configures build
5. Set environment variables in Railway dashboard

**Railway free tier:** $5 free credit/month, includes database hosting.

### Option C: Docker Self-Hosting (Any VPS)

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build standalone
docker build -t comfortair-pro .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e NEXTAUTH_SECRET="..." \
  -e NEXTAUTH_URL="https://yourdomain.com" \
  comfortair-pro
```

Can be deployed to:
- **Oracle Cloud Free Tier** (always free ARM VM, 24GB RAM)
- **Google Cloud Run** (free tier: 2M requests/month)
- **Fly.io** (free tier: 3 shared VMs)

---

## 10. Domain & DNS Setup

### Free Domain Options

1. **Vercel subdomain** (current): `learning-project-gules-mu.vercel.app` (production), `dev-learning-project.vercel.app` (dev)
2. **Freenom** (free TLDs): `.tk`, `.ml`, `.ga`, `.cf`
3. **is-a.dev**: Free `yourname.is-a.dev` subdomain via GitHub PR
4. **js.org**: Free `yourproject.js.org` subdomain

### Custom Domain Setup (Vercel)

1. In Vercel dashboard: Settings → Domains → Add Domain
2. Enter your domain (e.g., `comfortairpro.com`)
3. Configure DNS at your registrar:
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME Record**: `www` → `cname.vercel-dns.com`
4. Vercel automatically provisions SSL certificate

### DNS Propagation

```bash
# Check DNS propagation
dig comfortairpro.com +short
nslookup comfortairpro.com
```

---

## 11. Environment Variables & Secrets Management

### Required Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `DATABASE_URL` | Server | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Server | JWT signing secret (32+ random bytes) |
| `NEXTAUTH_URL` | Server | Full URL of the app (e.g., `https://comfortairpro.com`) |

### Secret Generation

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### Where to Set Them

- **Local dev**: `.env` file (gitignored)
- **Vercel Production**: `DATABASE_URL` (production Neon branch), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **Vercel Preview**: `DATABASE_URL` (dev Neon branch), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- **GitHub Actions**: Repository Settings → Secrets and Variables → Actions
- **Docker**: `docker-compose.yml` or `-e` flags

### GitHub Actions Secrets Needed for Deploy

| Secret | Description |
|--------|-------------|
| `DATABASE_URL` | Production database connection string |
| `VERCEL_TOKEN` | Vercel API token (Account Settings → Tokens) |
| `VERCEL_ORG_ID` | Vercel team/org ID (Project Settings → General) |
| `VERCEL_PROJECT_ID` | Vercel project ID (Project Settings → General) |

---

## 12. Security Best Practices Implemented

1. **Password hashing**: bcrypt with 12 salt rounds
2. **CSRF protection**: NextAuth.js built-in CSRF tokens
3. **Security headers** (via `next.config.ts`):
   - `X-Frame-Options: DENY` (prevents clickjacking)
   - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
   - `Referrer-Policy: strict-origin-when-cross-origin`
4. **Input validation**: All API inputs validated with Zod schemas
5. **SQL injection prevention**: Prisma uses parameterized queries
6. **XSS prevention**: React's default output escaping + no dangerouslySetInnerHTML
7. **IP hashing**: User IPs are SHA-256 hashed, never stored in plain text
8. **Role-based access**: Middleware + page-level checks for admin routes
9. **Powered-by header disabled**: `poweredByHeader: false` in Next.js config
10. **Environment variables**: Secrets never committed to git
11. **Standalone build output**: Minimal attack surface in production container
12. **Docker non-root user**: Container runs as `nextjs` user (UID 1001)

---

## 13. Monitoring & Debugging

### Built-in Event Log System

The `EventLog` table captures all significant user actions with:
- Action name and category
- Hashed IP and truncated user agent
- JSON metadata (flexible context)
- Timestamp

Access via Admin Panel → Analytics → Recent Event Logs.

### Free Monitoring Tools

1. **Vercel Analytics** (built into Vercel free tier):
   - Web Vitals (LCP, FID, CLS)
   - Page views and visitor counts
   - Real-time function logs

2. **Neon Dashboard**:
   - Query performance metrics
   - Connection stats
   - Storage usage

3. **Sentry** (free tier: 5K errors/month):
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```

4. **Better Uptime** (free tier):
   - Uptime monitoring
   - Status page
   - Alerts via email/Slack

### Vercel Logs

```bash
# View real-time function logs
vercel logs --follow

# View specific deployment logs
vercel logs [deployment-url]
```

---

## 14. Release Management

### Versioning Strategy: Semantic Versioning

```
v{MAJOR}.{MINOR}.{PATCH}
```
- **MAJOR**: Breaking changes (e.g., v2.0.0)
- **MINOR**: New features (e.g., v1.1.0)
- **PATCH**: Bug fixes (e.g., v1.0.1)

### Release Process

```bash
# 1. Create a release branch
git checkout -b release/v1.1.0

# 2. Make final changes, update version in package.json
npm version minor  # Automatically updates package.json and creates git tag

# 3. Push the branch and tag
git push origin release/v1.1.0
git push origin v1.1.0  # This triggers the deploy workflow

# 4. Create GitHub release
gh release create v1.1.0 --title "v1.1.0" --notes "Release notes here"

# 5. Merge back to main
git checkout main
git merge release/v1.1.0
git push origin main
```

### Deployments

- **Push to `main`** → CI runs (lint, type-check, build)
- **Push tag `v*`** → Deploy workflow runs (migrate DB, deploy to Vercel)
- **PR created** → CI runs
- **Manual CLI deploy** (required since no GitHub-Vercel integration):
  - Production: `npx vercel deploy --prod` (from main branch)
  - Dev: `npx vercel deploy` then `npx vercel alias <url> dev-learning-project.vercel.app` (from develop branch)

### Rollback

```bash
# Vercel instant rollback (via dashboard or CLI)
vercel rollback [deployment-url]

# Database rollback (if migration fails)
npx prisma migrate resolve --rolled-back [migration-name]
```

---

## 15. Development Workflow Commands

### Daily Development

```bash
# Start development server
npm run dev                    # Runs at http://localhost:3000

# Start local PostgreSQL (via Docker)
docker-compose up db -d        # Just the database

# Run database migrations
npm run db:migrate             # Creates/applies migration files
npm run db:push                # Quick sync (no migration file)

# Generate Prisma client after schema changes
npm run db:generate

# Seed the database
npm run db:seed

# Open Prisma Studio (visual database editor)
npm run db:studio              # Opens at http://localhost:5555
```

### Code Quality

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit

# Build (production)
npm run build

# Start production server locally
npm run start
```

### Docker

```bash
# Full stack (app + database)
docker-compose up -d

# Build image only
docker build -t comfortair-pro .

# Stop all
docker-compose down

# Stop and remove volumes (deletes database)
docker-compose down -v
```

### Git Workflow

```bash
# Feature branch workflow
git checkout -b feature/new-feature
# ... make changes ...
git add -A
git commit -m "feat: add new feature"
git push -u origin feature/new-feature
# Create PR via GitHub or:
gh pr create --title "feat: add new feature" --body "Description"
```

---

## 16. Cost Summary (All Free Tier)

| Service | Free Tier Limits | Purpose |
|---------|-----------------|---------|
| **Vercel** | 100 GB bandwidth, unlimited deploys | Hosting |
| **Neon PostgreSQL** | 0.5 GB storage, 190 compute hrs/month | Database |
| **GitHub** | Unlimited public repos, 2000 CI minutes/month | Code & CI/CD |
| **GitHub Actions** | 2000 minutes/month (public repos: unlimited) | CI/CD |
| **Vercel Analytics** | Included in free tier | Basic analytics |
| **Let's Encrypt** | Free (auto-provisioned by Vercel) | SSL/TLS |

**Total monthly cost: $0**

### When to Upgrade (Growth Milestones)

- **> 100 GB bandwidth**: Vercel Pro ($20/month)
- **> 0.5 GB database**: Neon Launch ($19/month)
- **Custom domain**: ~$10-15/year from any registrar
- **Email service** (for notifications): Resend free tier (100 emails/day)

---

## Quick Start Checklist

- [x] Next.js 16 project created with TypeScript + Tailwind
- [x] Prisma schema with all models and enums
- [x] NextAuth.js authentication with credentials provider
- [x] Public pages: Home, Services, About, Contact, Book Service
- [x] Customer dashboard with service request tracking
- [x] Admin panel with full management capabilities
- [x] Event logging system with privacy protections
- [x] API routes with Zod validation
- [x] Role-based middleware protection
- [x] GitHub repository with branch protection
- [x] CI/CD workflows (lint, type-check, build, deploy)
- [x] Dockerfile and docker-compose.yml
- [x] Security headers and best practices
- [x] Seed data for demo/testing
- [x] ~~**DONE**: Create Neon database and set `DATABASE_URL`~~ (Neon project: square-union-44573497, region: ap-southeast-1)
- [x] ~~**DONE**: Deploy to Vercel and set environment variables~~ (production + dev environments live)
- [x] ~~**DONE**: Run `prisma migrate deploy` against production DB~~
- [x] ~~**DONE**: Run seed script against production DB~~
- [ ] **TO DO**: Configure custom domain (optional)
