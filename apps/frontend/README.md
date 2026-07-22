# KMS Frontend

The user interface for the Knowledge Management System.

## Stack

- React 18
- Vite
- TypeScript
- TailwindCSS

## Features

- **Health Check UI**: Displays real-time status of API, DB, and S3.
- **Asset Uploading**: Upload files directly to S3 with DB metadata tracking. Supports text documents and images.
- **Asset Gallery**: View a responsive grid of uploaded documents, including automatically generated thumbnails for images.

## Development

To start the development server independently:

```bash
pnpm run dev
```

It expects the backend to be running on `http://localhost:3000` (or as configured). The frontend currently runs on `http://localhost:5173`.

## Testing

_(Integration and unit tests will be implemented via Vitest in upcoming PRs)_
