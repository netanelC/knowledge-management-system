# ==========================================
# Stage 1: Prune (Extract only what we need)
# ==========================================
FROM node:24-alpine AS base
WORKDIR /app

# ---
FROM base AS prepare
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune frontend backend --docker

# ==========================================
# Stage 2: Build (Leverage Cache & Compile)
# ==========================================
FROM base AS builder
RUN npm install -g pnpm@11.0.9
WORKDIR /app

# Cache dependencies
COPY --from=prepare /app/out/json/ .
RUN pnpm install --config.ignore-scripts=true

# Copy source code
COPY --from=prepare /app/out/full/ .

# Declare build args
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Generate Prisma Client & Build Frontend
RUN pnpm --filter backend exec prisma generate
RUN pnpm turbo run build --filter=frontend...

# ==========================================
# Stage 3: Runner (Serve SPA via serve)
# ==========================================
FROM node:24-alpine AS runner
WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/apps/frontend/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
