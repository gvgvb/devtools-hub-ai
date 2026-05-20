#!/usr/bin/env bash
set -e

echo "This script helps you securely add GROQ_API_KEY to .env.local (local only)."

# Prompt for key hidden
read -sp "Paste your GROQ_API_KEY (input hidden): " GROQ_KEY
echo

if [ -z "$GROQ_KEY" ]; then
  echo "No key provided. Aborting."
  exit 1
fi

cat > .env.local <<EOF
GROQ_API_KEY=$GROQ_KEY
# Optional overrides (uncomment if needed)
# GROQ_MODEL=llama-3.1-8b-instant
# AI_TIMEOUT_MS=15000
EOF

echo ".env.local created (will be ignored by .gitignore if configured)."

echo "You can now start the server. Choose one of the following commands depending on your workflow:"
echo "  npm run start   # start server on port 3000"
echo "  npm run dev     # start server + vite dev"

echo "If you want this script to start the server automatically, run it with --start flag."

if [ "$1" = "--start" ]; then
  echo "Starting server (npm run start)..."
  npm run start
fi
