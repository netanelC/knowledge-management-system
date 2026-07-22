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

## Features & Supported Formats

- **File Upload:** Upload text documents (`.txt`, `.md`, `.csv`) and image files (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`).
- **Text Extraction:** Automatically extracts raw string content from uploaded text files and persists it in the database (`extractedText` column).
- **S3 Storage:** Assets are streamed directly to S3 and served back with exact MIME content headers.
- **Database Persistence:** Metadata and extracted text stored with Prisma PostgreSQL ORM.

## Architecture

- `apps/frontend`: Vite + React + TypeScript frontend
- `apps/backend`: Express + TypeScript backend with Prisma ORM
- `packages/types`: Shared TypeScript definitions and format utilities
