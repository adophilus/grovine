FROM oven/bun:alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk add --no-cache python3 make g++ bash nodejs npm
RUN bun add -g pnpm
RUN npm add -g @infisical/cli@0.41.1

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile


RUN --mount=type=secret,id=INFISICAL_CLIENT_ID,env=INFISICAL_CLIENT_ID \
  --mount=type=secret,id=INFISICAL_CLIENT_SECRET,env=INFISICAL_CLIENT_SECRET \
  --mount=type=secret,id=INFISICAL_PROJECT_ID,env=INFISICAL_PROJECT_ID \
  --mount=type=secret,id=INFISICAL_DOMAIN,env=INFISICAL_DOMAIN \
  --mount=type=secret,id=INFISICAL_ENV,env=INFISICAL_ENV \
  ./scripts/docker-build-script.sh

FROM oven/bun:alpine AS runner

RUN apk add --no-cache bash nodejs npm
RUN bun add -g serve
RUN npm add -g @infisical/cli@0.41.1

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/scripts ./scripts

ENTRYPOINT ["./scripts/docker-entrypoint.sh"]
