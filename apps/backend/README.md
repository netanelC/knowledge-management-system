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
Provide the database connection string in `apps/backend/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/knowledge_management_system?schema=public"
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
