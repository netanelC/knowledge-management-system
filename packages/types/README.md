# KMS Types

Shared TypeScript definitions for the Knowledge Management System, used across the frontend and backend.

## Usage

Import the types into your packages by adding `types` to the `package.json` dependencies. Turborepo and your package manager will resolve this to the local workspace package.

Example:

```typescript
import { HealthResponse } from 'types';
```

## Building

The types are automatically built when running `pnpm run build` from the root, or you can build them directly from this directory:

```bash
pnpm run build
```
