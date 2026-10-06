# syntax=docker/dockerfile:1

ARG NODE_VERSION=22
ARG PNPM_VERSION=10.11.0

FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-alpine AS build
ARG PNPM_VERSION
WORKDIR /src

RUN npm install --global pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm fetch --frozen-lockfile

COPY . ./

ENV VITE_BASE_URL=http://localhost:3000 \
    VITE_API_BASE_URL=https://ftel-api-base-url.invalid

RUN pnpm install --offline --frozen-lockfile \
    && pnpm build

FROM node:${NODE_VERSION}-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    VITE_API_BASE_URL=http://localhost:5082/api

COPY --from=build --chown=root:root /src/.output ./template
COPY --chmod=555 ftel-entrypoint.sh /usr/local/bin/ftel-entrypoint.sh

RUN mkdir output && chown node:node output

USER node

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --spider "http://127.0.0.1:3000/" || exit 1

ENTRYPOINT ["ftel-entrypoint.sh"]
