# Knowledge Management System - Product Requirements Document (Spec)

## Problem Statement

The user needs to implement a knowledge management system as a home assignment. The system must allow users to upload text files and images, and securely store them. It must also provide a smart search capability to find these assets based on their content and properties (e.g., searching for "black hair" to find relevant images or text).

## Solution

A fullstack web application using React (Vite) and Node.js (Express) within a Turborepo monorepo. When a file is uploaded, it is stored in AWS S3. The Gemini AI service analyzes the file to generate metadata (description and keywords) and extracts text (for documents). This data is stored in a PostgreSQL database (using Prisma). Users can query the system through a search interface that performs full-text matching against the filename, extracted text, AI description, and AI keywords.

## User Stories

1. As a user, I want to upload an image file, so that it is securely stored in the knowledge management system.
2. As a user, I want to upload a text document, so that its contents are indexed in the knowledge management system.
3. As a user, I want the system to automatically generate descriptive metadata (keywords, description) for my uploaded images, so that I can discover them through semantic search queries.
4. As a user, I want the system to automatically extract text from my uploaded documents, so that I can search for exact phrases within the documents later.
5. As a user, I want to search using natural language keywords (e.g., "black hair"), so that I can find assets matching that concept without needing to know the exact filename.
6. As a user, I want to see a list of relevant assets returned from my search, so that I can browse the results.
7. As a user, I want to view or download the original asset from the search results, so that I can use the knowledge I found.

## Implementation Decisions

- **Architecture:** Monorepo using Turborepo and pnpm workspaces. Will include a `types` package to share TypeScript interfaces and domain types between the `frontend` and `backend`.
- **Frontend:** React, Vite, TypeScript, TailwindCSS.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL. Uses the `config` npm package for robust environment variable and configuration management.
- **Database Schema (Prisma):**
  - `Asset`: `id` (UUID - also serves as S3 object key), `filename` (String), `type` (Enum: `IMAGE`, `DOCUMENT`), `extractedText` (String, optional), `createdAt` (DateTime).
  - `AssetMetadata`: `assetId` (UUID - Primary Key & Foreign Key), `description` (String), `keywords` (String).
- **Storage:** AWS S3 for binary storage of images and documents. The asset's UUID is used as the S3 object key.
- **AI Integration:** Google Gemini API (`@google/generative-ai`) for metadata generation and text extraction.
- **API Contracts:**
  - `POST /api/assets` (multipart/form-data): Uploads file, triggers AI processing, saves to DB, returns created Asset.
  - `GET /api/assets?q={query}`: Returns list of Assets matching the search query via full-text search against the database fields.
- **Deployment:** Containerized multi-stage Dockerfile that builds and serves the backend and frontend together.

## Testing Decisions

- A good test in this system will verify the external behavior of the endpoints and the user interface without coupling to internal logic like service classes or database ORM specifics.
- **Backend Tests:** E2E API tests using Supertest. We will test the `POST /api/assets` and `GET /api/assets` endpoints.
- **Mocking:** The AWS S3 client and Google Gemini API client will be mocked at the highest boundary to avoid network calls and cloud costs during testing.
- **Database:** A dedicated test database instance (or transaction rollback strategy) will be used to ensure tests don't pollute each other.
- **Frontend Tests:** Component tests using Vitest/Testing Library to verify the upload form submission and search result rendering.

## Out of Scope

- Authentication and user login.
- Role-based authorization.
- Advanced scalability configurations (e.g., read replicas, distributed caching).
- Production-grade security hardening.
- Editing or deleting uploaded assets (immutable append-only system).

## Further Notes
- Since this is a home assignment, simplicity and clear engineering approaches are prioritized over raw production readiness.
