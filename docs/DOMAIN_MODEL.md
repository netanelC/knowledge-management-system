# Knowledge Management System - Domain Model & Architecture

## 1. Domain Entities

### `Asset`

Represents an uploaded file in the knowledge system.

- `id`: string (UUID) - _Also serves as the S3 object key_
- `filename`: string (Original name)
- `type`: enum (`IMAGE`, `DOCUMENT`) - Useful for the frontend to know whether to render an `<img>` tag or a text viewer.
- `extractedText`: string (Optional - content of the text file) - Needed for text files because the assignment requires searching for documents that "include the text". We must store the raw text to perform exact text matching during a search.
- `createdAt`: Date

### `AssetMetadata` (1-to-1 with Asset)

AI-generated metadata to power the smart search.

- `assetId`: string (Primary Key & Foreign Key)
- `description`: string (AI-generated summary/description)
- `keywords`: string[] (AI-generated tags for searchability)

## 2. API Endpoints (Backend)

- `POST /api/assets`
  - Accepts a multipart/form-data file upload.
  - Uploads file to AWS S3.
  - Triggers Gemini API to generate metadata/tags based on the file.
  - Saves the Asset and Metadata to the database.

- `GET /api/assets`
  - Accepts a `q` (query) parameter for search.
  - Returns a list of assets matching the query (searches across filename, extracted text, AI description, and AI keywords).

## 3. Technology Stack

- **Monorepo**: Turborepo (with pnpm).
- **Backend**: Node.js, Express, TypeScript, Prisma ORM, PostgreSQL (for robust relational data and full-text search capabilities). Uses the `config` npm package for robust configuration management.
- **Frontend**: React, Vite, TypeScript, TailwindCSS (for rapid UI styling).
- **Shared**: A dedicated `types` internal package for sharing TypeScript types and constants between the backend and frontend.
- **AI Integration**: Google Gemini API (`@google/generative-ai`).
- **Storage**: AWS S3 (via `@aws-sdk/client-s3`).
- **Testing**: Vitest + Supertest.
- **Tooling**: ESLint, Prettier, GitHub Actions (CI).

## 4. Deployment Strategy

A multi-stage `Dockerfile` that builds the React frontend, builds the Express backend, and serves the static frontend files from the Express server. This allows for a simple 1-container deployment.
