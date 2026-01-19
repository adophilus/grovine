#!/bin/sh

set -e

export INFISICAL_TOKEN=$(infisical login --method=universal-auth --client-id=$INFISICAL_CLIENT_ID --client-secret=$INFISICAL_CLIENT_SECRET --domain $INFISICAL_DOMAIN --silent --plain)

eval "$(infisical export --projectId $INFISICAL_PROJECT_ID --env $INFISICAL_ENV --domain $INFISICAL_DOMAIN --format=dotenv-export)"

cd build

cd docs
echo "Serving static docs..."
serve -p $DOCS_PORT -s 2>&1 > /dev/null &

cd ../backend 
echo "Starting backend..."
node ./server.mjs &

wait
