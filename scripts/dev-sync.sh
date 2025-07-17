#!/bin/sh

set -a
. "$(dirname "$0")/.env"
set +a

BRIDGE_URL="http://host.docker.internal:5173"

echo "Syncing Novu workflows..."

echo "Using Novu API URL: $NOVU_API_URL"
echo "Using Novu Secret Key: $NOVU_SECRET_KEY"
echo "Using Bridge URL: $BRIDGE_URL"

pnpx novu@latest sync --bridge-url "$BRIDGE_URL/api/novu" \
  --api-url "$NOVU_API_URL" \
  --secret-key "$NOVU_SECRET_KEY"

echo "Sync complete"