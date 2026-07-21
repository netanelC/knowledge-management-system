# Knowledge Management System (KMS)

A fullstack monorepo application using Turborepo, React (Vite), Express, and Prisma.

## Prerequisites

- Node.js >= 22
- pnpm >= 11
- PostgreSQL >= 15

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Environment Variables & Configuration:
   The application uses the `config` npm package for configuration. Instead of a `.env` file, database connections and settings are stored in `apps/backend/config/default.json` and `test.json`.
   Prisma is configured to dynamically read these settings via `prisma.config.ts`.

3. Database Initialization:
   Generate the Prisma client (and push the schema if needed):
   ```bash
   cd apps/backend
   npx prisma generate
   ```

## Scripts

Run all scripts from the root directory using Turborepo:

- **Development:** `pnpm run dev` (Starts frontend and backend dev servers)
- **Build:** `pnpm run build` (Builds all packages)
- **Lint:** `pnpm run lint` (Lints all packages)
- **Test:** `pnpm run test` (Runs tests across all packages)
- **Format:** `pnpm run format:fix` (Formats codebase using Prettier)

## Architecture

- `apps/frontend`: Vite + React + TypeScript frontend
- `apps/backend`: Express + TypeScript backend with Prisma ORM
- `packages/types`: Shared TypeScript definitions
