#!/bin/bash

set -e

echo "=============================================="
echo " 🚀 EMenu Owner Cambodia – Simple Deploy"
echo "=============================================="

# Load env
if [ -f .env.production ]; then
  export $(grep -v '^#' .env.production | xargs)
  echo "✅ Environment loaded"
else
  echo "❌ .env.production not found"
  exit 1
fi

echo ""
echo "[1/4] Installing dependencies..."
npm install
echo "✅ npm install done"

echo ""
echo "[2/4] Building application..."
npm run build
echo "✅ Build successful"

echo ""
echo "[3/4] Creating PM2 config..."

mkdir -p logs

cat > pm2.config.js <<EOF
module.exports = {
  apps: [{
    name: "emenu-owner",
    script: "npm",
    args: "start",
    exec_mode: "fork",
    instances: 1,
    env: {
      NODE_ENV: "production",
      PORT: "${PORT:-3000}"
    },
    env_file: ".env.production",
    out_file: "./logs/out.log",
    error_file: "./logs/error.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss"
  }]
};
EOF

echo "✅ PM2 config created"

echo ""
echo "[4/4] Restarting PM2..."
pm2 delete emenu-owner 2>/dev/null || true
pm2 start pm2.config.js
pm2 save

echo ""
echo "🎉 DEPLOYMENT SUCCESS"
pm2 status
