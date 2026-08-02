# ==========================================
# Stage 1: Prune (Extract only what we need)
# ==========================================
FROM node:24-alpine AS base
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# ---
FROM base AS prepare
RUN npm install -g turbo@^2
COPY . .
RUN turbo prune backend --docker

# ==========================================
# Stage 2: Build (Leverage Cache & Compile)
# ==========================================
FROM base AS builder
RUN npm install -g pnpm@11.0.9
WORKDIR /app

# FIRST: Copy ONLY the package.jsons and lockfiles
COPY --from=prepare /app/out/json/ .

# Install dependencies. Docker will CACHE this layer!
RUN pnpm install --frozen-lockfile

# SECOND: Now copy the actual source code
COPY --from=prepare /app/out/full/ .

# Generate Prisma Client & Build Turborepo projects
RUN pnpm --filter backend exec prisma generate
RUN pnpm turbo run build

# ==========================================
# Stage 3: Runner (Production Environment)
# ==========================================
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy cleanly from the builder stage
COPY --from=builder /app .

WORKDIR /app/apps/backend

EXPOSE 8080

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/index.js"]
