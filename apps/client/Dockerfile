# syntax=docker/dockerfile:1.7

# Build context: monorepo root (see docker-compose.yml)
#   docker build -f apps/client/Dockerfile .

ARG NODE_VERSION=24
ARG PNPM_VERSION=11.20.0

FROM node:${NODE_VERSION}-slim AS base
ENV PNPM_HOME=/pnpm \
	PATH=/pnpm:$PATH \
	CI=true \
	TURBO_TELEMETRY_DISABLED=1 \
	DO_NOT_TRACK=1 \
	# CI networks are slow/flaky; be patient instead of failing the build
	PNPM_FETCH_TIMEOUT=120000 \
	PNPM_FETCH_RETRIES=5 \
	PNPM_FETCH_RETRY_MINTIMEOUT=10000 \
	PNPM_FETCH_RETRY_MAXTIMEOUT=120000 \
	PNPM_FETCH_RETRY_FACTOR=2
WORKDIR /app
RUN corepack enable \
	&& corepack prepare pnpm@${PNPM_VERSION} --activate \
	&& pnpm config set store-dir /pnpm/store

# ---------------------------------------------------------------------------
# deps: workspace install, cached until the lockfile / manifests change
# ---------------------------------------------------------------------------
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/client/package.json apps/client/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
	pnpm install --frozen-lockfile

# ---------------------------------------------------------------------------
# build: compile @drivn/shared then the Vite bundle
# ---------------------------------------------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/apps/client/node_modules ./apps/client/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .

# Vite inlines these at build time — they are the URLs the *browser* uses,
# so they must be reachable from outside the compose network.
ARG VITE_API_URL
ARG VITE_FRONTEND_URL
ENV VITE_API_URL=${VITE_API_URL} \
	VITE_FRONTEND_URL=${VITE_FRONTEND_URL}

RUN pnpm turbo run build --filter=client...

# ---------------------------------------------------------------------------
# runtime: static files served by nginx
# ---------------------------------------------------------------------------
FROM nginx:1.29-alpine AS runtime
RUN rm -f /etc/nginx/conf.d/default.conf
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/client/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD wget -qO- http://127.0.0.1/healthz >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
