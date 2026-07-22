# KMS Backend

The backend API for the Knowledge Management System.

## Stack

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL

## Configuration

The backend uses the `config` npm package.
Environment variables are mapped via `custom-environment-variables.json` and default values are defined in `default.json`.

Available environment variables:

- `DATABASE_URL` (Required)
- `GEMINI_API_KEY` (Optional - for AI metadata generation)
- `GEMINI_MODEL` (Optional - defaults to `gemini-3.5-flash-lite`)
- `AWS_REGION`
- `AWS_S3_BUCKET`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_ENDPOINT`
- `AWS_S3_FORCE_PATH_STYLE`

## API Endpoints

- `GET /api/health` - Check health status of API, Database, and S3 Storage.
- `GET /api/assets` - Retrieve all uploaded assets from the database.
- `POST /api/assets` - Upload a new asset (multipart/form-data with `file` field). Supports text (`.txt`, `.md`, `.csv`) and image (`.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`) formats. Text document contents are automatically extracted and saved to `extractedText`.
- `GET /api/assets/:id/content` - Stream asset content from S3 with proper Content-Type header.

## Development

Generate the Prisma client before starting:

```bash
npx prisma generate
```

Start the development server:

```bash
pnpm run dev
```

The server runs on `http://localhost:3000` by default.

## Testing

Run integration tests using Vitest:

```bash
pnpm run test
```
