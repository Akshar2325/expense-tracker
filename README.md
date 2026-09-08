# Smart Expense Tracker

A production-grade, full-stack personal finance application built as a pnpm + Turborepo monorepo.

## Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Monorepo   | pnpm workspaces + Turborepo                   |
| Backend    | NestJS 10, TypeScript, Passport JWT, Argon2id |
| ORM        | Prisma 7 (PostgreSQL adapter)                 |
| Database   | PostgreSQL 18                                 |
| Validation | Zod (shared package)                          |
| Frontend   | Next.js App Router + Tailwind CSS             |
| Infra      | Docker Compose (PostgreSQL, Redis, Mailhog)   |

## Project Structure

```
expense-tracker/
├── apps/
│   └── api/                  # NestJS REST API
├── packages/
│   ├── database/             # Prisma schema + client + seed
│   ├── validation/           # Shared Zod schemas
│   ├── types/                # Shared TypeScript types
│   ├── tsconfig/             # Shared tsconfig presets
│   └── eslint-config/        # Shared ESLint config
├── infrastructure/           # Docker Compose
└── turbo.json
```

## Getting Started

### 1. Prerequisites

- Node.js ≥ 22 (Node 24 recommended)
- pnpm ≥ 9
- PostgreSQL (or Docker)

### 2. Install dependencies

```bash
pnpm install
```

### 3. Start infrastructure (optional, if not using local PostgreSQL)

```bash
docker compose -f infrastructure/docker-compose.yml up -d
```

### 4. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
cp packages/database/.env.example packages/database/.env
```

### 5. Generate Prisma client & seed

```bash
pnpm --filter @expense-tracker/database prisma:generate
pnpm --filter @expense-tracker/database prisma:push
pnpm --filter @expense-tracker/database prisma:seed
```

### 6. Run the API

```bash
pnpm --filter @expense-tracker/api dev
```

- API: http://localhost:3001/api/v1
- Swagger docs: http://localhost:3001/api/docs

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `pnpm build`       | Build all packages             |
| `pnpm dev`         | Run all dev servers            |
| `pnpm lint`        | Lint all packages              |
| `pnpm test`        | Run all tests                  |
| `pnpm db:push`     | Push Prisma schema to database |
| `pnpm db:seed`     | Seed the database              |
| `pnpm db:generate` | Regenerate Prisma client       |

## API Modules

- **Auth** — register, login, refresh, logout, forgot/reset password
- **Users** — profile, change password
- **Accounts** — bank/cash/wallet accounts with balance tracking
- **Categories** — expense/income categories + system defaults
- **Payment Methods** — UPI, cards, bank transfer, etc.
- **Transactions** — CRUD with idempotency, filters, search
- **Budgets** — monthly budgets with progress tracking
- **Recurring Transactions** — scheduled recurring entries
- **Tags** — transaction tagging
- **Reports** — summary, category breakdown, trends
- **Insights** — dashboard insights & spending patterns
- **Receipts** — receipt metadata & OCR status
- **Exports** — CSV/PDF/JSON export jobs
- **Sync** — device sync state & cursor
- **Saved Filters** — persisted filter presets
- **Health** — service health check
