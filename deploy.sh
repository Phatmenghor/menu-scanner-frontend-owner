#!/bin/bash

# ========================================================================
# 🚀 COMPLETE DEPLOY FOR EMenu Owner Cambodia
# ========================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Run with: sudo bash deploy.sh${NC}"
    exit 1
fi

set -e

clear
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          🚀 EMenu Owner Cambodia 🚀                        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

npm install

npm run build

# ========================================================================
# PM2 CONFIG
# ========================================================================
echo -e "${YELLOW}[8/9] Creating PM2 config...${NC}"
cat > pm2.config.js << EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'npm',
    args: 'start',
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    env: {
      NODE_ENV: '${NODE_ENV}',
      PORT: '${PORT}'
    },
    env_file: ".env.production",
    log_file: "./logs/app.log",
    out_file: "./logs/out.log",
    error_file: "./logs/error.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true,
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: "10s",
    max_memory_restart: "800M",
    autorestart: true,
    kill_timeout: 5000,
    listen_timeout: 10000
  }]
};
EOF
echo -e "${GREEN}✅ PM2 config created${NC}"
echo ""

# ========================================================================
# START PM2
# ========================================================================
echo -e "${YELLOW}[9/9] Starting application...${NC}"
pm2 start pm2.config.js
sleep 5
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true
echo -e "${GREEN}✅ Application started${NC}"
echo ""

# ========================================================================
# SUMMARY
# ========================================================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                 🎉 DEPLOYMENT SUCCESS! 🎉                ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}🌐 Frontend:${NC}  http://${DEPLOY_IP}:${EXTERNAL_PORT}"
echo -e "${BLUE}🔗 API:${NC}       ${NEXT_PUBLIC_API_BASE_URL}/*"
echo -e "${BLUE}🔗 Backend:${NC}   ${BACKEND_API_URL}"
echo -e "${BLUE}🩺 Health:${NC}    http://${DEPLOY_IP}:${EXTERNAL_PORT}/health"
echo ""
pm2 status
echo ""
free -h
