#!/usr/bin/env bash

set -euo pipefail

echo "🔧 Running post-install hook to fix worklets duplicate class issue..."

# Run the fix script
node scripts/fix-worklets.js

echo "✅ Post-install hook completed!"