#!/bin/sh

set -e

export INFISICAL_TOKEN=$(infisical login --method=universal-auth --client-id=$INFISICAL_CLIENT_ID --client-secret=$INFISICAL_CLIENT_SECRET --domain $INFISICAL_DOMAIN --silent --plain)

infisical run \
  --projectId $INFISICAL_PROJECT_ID \
  --env $INFISICAL_ENV \
  --domain $INFISICAL_DOMAIN \
  --command "pnpm build"

pnpm typecheck
pnpm lint
# pnpm audit --audit-level high
# pnpm test

mkdir build

cp -r ./apps/backend/build ./build/backend
cp -r ./apps/docs/docs/.vitepress/dist ./build/docs
