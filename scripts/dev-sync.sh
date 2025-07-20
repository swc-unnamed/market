#!/bin/sh

set -a
. "$(dirname "$0")/../.env"
set +a

BRIDGE_URL=http://host.docker.internal:5173
# NGROK_PORT=5173
# NGROK_DOMAIN="$BRIDGE_URL"
# echo "Starting ngrok with domain $NGROK_DOMAIN on port $NGROK_PORT..."
# ngrok http --url=$NGROK_DOMAIN $NGROK_PORT > /tmp/ngrok.log 2>&1 &
# NGROK_PID=$!
# sleep 3

echo "Syncing Novu workflows..."
echo "Using Novu API URL: $NOVU_API_URL"
echo "Using Novu Secret Key: $NOVU_SECRET_KEY"
echo "Using Bridge URL: $BRIDGE_URL"

pnpx novu@latest sync --bridge-url "$BRIDGE_URL/api/novu" \
  --api-url "$NOVU_API_URL" \
  --secret-key "$NOVU_SECRET_KEY"

# echo "Stopping ngrok (PID $NGROK_PID)..."
# kill $NGROK_PID

echo "Sync complete"