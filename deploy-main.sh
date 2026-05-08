#!/usr/bin/env bash
set -e

if [ -z "$VERCEL_TOKEN" ]; then
  echo "Error: VERCEL_TOKEN is not set."
  echo "Usage: VERCEL_TOKEN=your_token ./deploy-main.sh"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "Deploying cipherra-main → cipherra.ai"
cd "$REPO_ROOT"

npx vercel deploy --prod \
  --token "$VERCEL_TOKEN" \
  --scope "nithesh2108-8379s-projects" \
  --yes

echo "Done."
