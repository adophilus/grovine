FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache python3 make g++ bash
 

FROM base AS build

WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

ENV NODE_ENV=production
RUN pnpm --filter @grovine/backend run build
 

FROM base AS dokploy

WORKDIR /app
ENV NODE_ENV=production
 
# Copy only the necessary files
COPY --from=build /app/apps/backend/build/server.mjs ./
 
EXPOSE $PORT

CMD ["node", "./server.mjs"]
