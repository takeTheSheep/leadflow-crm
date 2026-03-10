# LeadFlow CRM

LeadFlow CRM is a premium, production-minded demo SaaS for lead operations teams.

It demonstrates full-stack architecture for modern B2B workflows: secure authentication, role-based access, lead lifecycle management, pipeline operations, analytics, activity auditing, and settings governance.

## Product Concept

LeadFlow CRM helps teams:

- capture and qualify inbound leads
- assign ownership with role-based control
- progress opportunities through a visual pipeline
- log notes/tasks/activity history for accountability
- monitor conversion and forecast metrics from dashboards

## Tech Stack

### Frontend

- Next.js (App Router) + TypeScript
- Tailwind CSS (custom premium light system)
- React Hook Form + Zod
- TanStack Table
- Recharts
- Zustand (UI state)

### Backend

- Next.js Route Handlers + Server Actions
- Prisma ORM
- PostgreSQL
- NextAuth Credentials authentication
- Role-based authorization layer
- Validation + security wrappers + rate-limiting abstraction

## Core Features

### Marketing + Auth

- Landing page with premium sections and interactive preview
- Features, Pricing, Security, Privacy, Terms pages
- Login page
- Demo workspace registration flow

### Authenticated Application

- Dashboard: KPI cards, trend charts, activities, follow-up queue, team mini-performance
- Leads: searchable/filterable/sortable table, pagination, selection, bulk actions, quick-create modal
- Lead Detail: overview, notes, activity, tasks, quick actions, file/email placeholders
- Pipeline: kanban-style stage board with value totals and stage movement
- Analytics: funnel, source performance, stage velocity, completion, forecast
- Activity: chronological audit feed with filters
- Team: role-aware performance cards and leaderboard
- Settings: profile, workspace, notifications, security, permissions, integration placeholders

## Security and Hardening Notes

Implemented foundations:

- server-side Zod validation for mutations
- workspace-scoped queries and mutations
- role-based authorization checks on sensitive operations
- credential hashing with bcrypt
- login rate-limiting and mutation throttling abstraction
- audit trail records for lead lifecycle actions
- soft delete pattern for leads
- safe error shaping (no sensitive details leakage)
- secure middleware headers

Roadmap placeholders included for:

- 2FA
- anomaly detection
- email verification
- bot protection
- webhook signature verification
- observability/alerting hooks

## Architecture Summary

Domain entities:

- User, Workspace, Membership
- Lead, LeadNote, LeadActivity
- Task
- Tag, LeadTag
- LeadSource
- PipelineStage
- Notification
- SavedFilter
- LoginEvent
- NextAuth Account/Session/VerificationToken

Layering approach:

- `src/app` for routes/pages
- `src/components` for reusable UI
- `src/lib/validation` for schema validation
- `src/lib/permissions` for RBAC rules
- `src/lib/repositories` for query composition
- `src/lib/services` for business logic and audit-aware mutations
- `src/server/queries` and `src/server/actions` for server entry points
- `src/lib/security` and `src/lib/rate-limit` for hardening primitives

## Folder Structure

```text
.
|-- prisma/
|   |-- schema.prisma
|   `-- seed.ts
|-- public/
|   |-- images/
|   |-- icons/
|   `-- og/
|-- src/
|   |-- app/
|   |   |-- (marketing)/
|   |   |-- (auth)/
|   |   |-- (dashboard)/
|   |   `-- api/
|   |-- components/
|   |-- lib/
|   |-- server/
|   |-- hooks/
|   |-- store/
|   |-- types/
|   |-- constants/
|   |-- data/
|   |-- emails/
|   `-- config/
|-- middleware.ts
|-- .env.example
`-- README.md
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file and configure:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run migrations:

```bash
npm run prisma:migrate
```

5. Seed demo data:

```bash
npm run prisma:seed
```

6. Start dev server:

```bash
npm run dev
```

## Demo Accounts (after seed)

- `admin@leadflowcrm.dev` / `DemoPass123!`
- `manager@leadflowcrm.dev` / `DemoPass123!`
- `emma@leadflowcrm.dev` / `DemoPass123!`

## Environment Variables

See `.env.example`.

Key variables:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `REDIS_URL` / `REDIS_TOKEN` (optional)
- `RESEND_API_KEY` (optional)
- `SENTRY_DSN` (optional)

## Deployment Notes

Prepared for:

- Vercel deployment for Next.js app
- Managed PostgreSQL
- Optional Redis for distributed rate limits/queues
- Environment separation by deployment stage

Recommended production additions:

- managed secrets and rotation policy
- background worker for reminders/notification pipelines
- centralized logging + Sentry/alerting
- automated backup and restore drills

## Docker Deployment (Server)

This repo now includes a server-ready Docker stack:

- `docker-compose.yml` for app + PostgreSQL
- `Dockerfile` for building/running the Next.js app
- `docker/entrypoint.sh` to run `prisma migrate deploy` before app start
- `.env.docker.example` as deployment env template

### 1. Prepare environment

```bash
cp .env.docker.example .env.docker
```

Set at minimum:

- `NEXTAUTH_URL` (your domain, e.g. `https://crm.example.com`)
- `NEXTAUTH_SECRET` (long random secret)
- `POSTGRES_PASSWORD` (strong password)

### 2. Build and run

```bash
docker compose --env-file .env.docker up -d --build
```

Check status/logs:

```bash
docker compose --env-file .env.docker ps
docker compose --env-file .env.docker logs -f app
```

### 3. Optional seed (first install only)

```bash
docker compose --env-file .env.docker exec app npm run prisma:seed
```

### 4. Stop stack

```bash
docker compose --env-file .env.docker down
```

To remove DB data volume too:

```bash
docker compose --env-file .env.docker down -v
```

Notes:

- App listens on `${APP_PORT}` (default `3000`).
- PostgreSQL is mapped to `${POSTGRES_PORT}` (default `5433`).
- If those ports are used, change them in `.env.docker`.

## Future Roadmap

- native drag-and-drop pipeline interactions
- email inbox sync and outbound sequencing
- saved filters and customizable views
- integration layer (webhooks + API tokens)
- stronger anti-abuse telemetry and anomaly alerts
