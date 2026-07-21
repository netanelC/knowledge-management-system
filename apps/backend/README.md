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
Create a `.env` file or provide the following environment variables:

```bash
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/knowledge_management_system?schema=public

# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_S3_BUCKET=local-bucket
AWS_ACCESS_KEY_ID=dummy
AWS_SECRET_ACCESS_KEY=dummy
```

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
