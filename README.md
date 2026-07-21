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

2. Environment Variables:
   Create a `.env` file in `apps/backend/` and configure your database and S3 settings:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/kms?schema=public"
   PORT=3000

   # S3 Configuration
   AWS_REGION="us-east-1"
   AWS_ACCESS_KEY_ID="your-access-key"
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_S3_BUCKET="your-bucket-name"

   # Optional: For local development with MinIO or LocalStack
   AWS_ENDPOINT_URL="http://localhost:9000"
   AWS_S3_FORCE_PATH_STYLE="true"
   ```

3. Database Initialization:
   Generate the Prisma client (and push the schema if needed):
   ```bash
   cd apps/backend
   npx prisma generate
   ```

## API Endpoints

- `GET /api/health` - Health check endpoint for API, Database, and S3.
- `POST /api/assets` - Upload a text or image file to S3 and save metadata in the database.
- `GET /api/assets` - Retrieve all uploaded asset metadata.
- `GET /api/assets/:id/download` - Stream an asset from S3 directly to the client.

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
