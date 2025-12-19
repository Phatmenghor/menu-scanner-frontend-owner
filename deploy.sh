#!/bin/bash

set -e

# ------------------------------------------------------------------
# AUTO FIX: Windows CRLF → Linux LF (runs once, safe to keep)
# ------------------------------------------------------------------
if grep -q $'\r' "$0"; then
  echo "🔧 Fixing Windows line endings..."
  sed -i 's/\r$//' "$0"
fi

clear

echo "================================================"
echo " 🚀 EMenu Owner Cambodia – Simple Deploy"
echo "================================================"

# ------------------------------------------------------------------
# Load environment variables
# ------------------------------------------------------------------
if [ ! -f .env.production ]; then
  echo "❌ .env.production not found"
  exit 1
fi

export $(grep -v '^#' .env.production | xargs)
echo "✅ Environment loaded"

# ------------------------------------------------------------------
# Install dependencies
# ------------------------------------------------------------------
echo ""
echo "[1/4] Installing dependencies..."
npm install
echo "✅ npm install completed"

# ------------------------------------------------------------------
# Build application
# ------------------------------------------------------------------
echo ""
echo "[2/4] Building application..."
npm run build
echo "✅ Build successful"

# ------------------------------------------------------------------
# Create PM2 config
# ------------------------------------------------------------------
echo ""
echo "[3/4] Creating PM2 configuration..."

mkdir -p logs

cat > pm2.config.js <<EOF
module.exports = {
  apps: [{
    name: "emenu-owner",
    script: "npm",
    args: "start",
    instances: 1,
    exec_mode: "fork",
    env: {
      NODE_ENV: "production",
      PORT: "${PORT:-3000}"
    },
    env_file: ".env.production",
    out_file: "./logs/out.log",
    error_file: "./logs/error.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    autorestart: true,
    max_memory_restart: "700M"
  }]
};
EOF

echo "✅ PM2 config created"

# ------------------------------------------------------------------
# Start / Restart PM2
# ------------------------------------------------------------------
echo ""
echo "[4/4] Restarting application..."

pm2 delete emenu-owner 2>/dev/null || true
pm2 start pm2.config.js
sleep 2
pm2 save

echo ""
echo "🎉 DEPLOYMENT SUCCESS"
pm2 status
