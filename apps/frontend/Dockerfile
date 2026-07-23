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

# Generate Prisma Client & Build Frontend
RUN pnpm --filter backend exec prisma generate
RUN pnpm turbo run build --filter=frontend...

# ==========================================
# Stage 3: Runner (Serve via Nginx)
# ==========================================
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
