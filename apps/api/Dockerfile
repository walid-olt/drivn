# syntax=docker/dockerfile:1.7

# Build context: monorepo root (see docker-compose.yml)
#   docker build -f apps/api/Dockerfile .

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
# build: compile @drivn/shared then the API
# ---------------------------------------------------------------------------
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/apps/client/node_modules ./apps/client/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY . .
RUN pnpm turbo run build --filter=api...

# ---------------------------------------------------------------------------
# prod-deps: production-only install. Kept as a full-workspace install so the
# pnpm symlink graph is identical to `deps` — the @drivn/shared workspace link
# and the root virtual store must stay consistent. Shares the pnpm store cache
# with the `deps` stage, so rebuilds are fast.
# ---------------------------------------------------------------------------
FROM base AS prod-deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY apps/client/package.json apps/client/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
	pnpm install --frozen-lockfile --prod

# ---------------------------------------------------------------------------
# runtime
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-slim AS runtime
ENV NODE_ENV=production \
	PORT=5000 \
	UPLOAD_DIR=/app/uploads
WORKDIR /app

# pnpm workspace layout (node_modules symlink targets must stay relative)
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=prod-deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=prod-deps /app/apps/api/package.json ./apps/api/package.json
COPY --from=prod-deps /app/packages/shared/package.json ./packages/shared/package.json

# compiled output
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/apps/api/dist ./apps/api/dist

# static assets — app.ts serves them relative to the working directory
COPY --from=build /app/apps/api/assets ./assets

# uploads are written to disk (named volume in compose)
RUN mkdir -p /app/uploads \
	&& chown -R node:node /app/uploads
VOLUME ["/app/uploads"]

USER node
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
	CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||5000)+'/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "apps/api/dist/server.mjs"]
