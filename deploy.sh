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

# ========================================================================
# LOAD ENVIRONMENT VARIABLES
# ========================================================================
if [ -f ".env.production" ]; then
    echo -e "${YELLOW}[0/9] Loading environment variables from .env.production...${NC}"
    export $(grep -v '^#' .env.production | xargs)
    echo -e "${GREEN}✅ Environment variables loaded${NC}"
else
    echo -e "${RED}❌ .env.production not found!${NC}"
    exit 1
fi
echo ""

# Use SERVER_IP from .env.production or auto-detect
DEPLOY_IP=${SERVER_IP:-$(hostname -I | awk '{print $1}')}

# ========================================================================
# CHECK AND ADD SWAP
# ========================================================================
echo -e "${YELLOW}[1/9] Checking swap...${NC}"

if [ $(free | grep Swap | awk '{print $2}') -eq 0 ]; then
    echo "❌ No swap found. Adding 3GB swap..."
    
    swapoff -a 2>/dev/null || true
    rm -f /swapfile
    
    fallocate -l 3G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    
    # Make permanent
    grep -v '/swapfile' /etc/fstab > /etc/fstab.tmp 2>/dev/null || cp /etc/fstab /etc/fstab.tmp
    mv /etc/fstab.tmp /etc/fstab
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    
    sysctl vm.swappiness=60
    grep -q 'vm.swappiness' /etc/sysctl.conf || echo 'vm.swappiness=60' >> /etc/sysctl.conf
    
    echo -e "${GREEN}✅ Swap added (3GB)${NC}"
else
    echo -e "${GREEN}✅ Swap already exists${NC}"
fi

echo ""
free -h
echo ""

# ========================================================================
# STOP PM2
# ========================================================================
echo -e "${YELLOW}[2/9] Stopping PM2...${NC}"
pm2 stop $APP_NAME 2>/dev/null || true
pm2 delete $APP_NAME 2>/dev/null || true
sleep 3
echo -e "${GREEN}✅ PM2 stopped${NC}"
echo ""

# ========================================================================
# PULL CODE
# ========================================================================
echo -e "${YELLOW}[3/9] Pulling latest code from $GIT_BRANCH...${NC}"
git fetch origin
git reset --hard origin/$GIT_BRANCH
echo -e "${GREEN}✅ Code updated${NC}"
echo ""

# ========================================================================
# CLEANUP
# ========================================================================
echo -e "${YELLOW}[4/9] Cleaning cache...${NC}"
npm cache clean --force 2>/dev/null || true
rm -rf .next
rm -rf node_modules/.cache
rm -rf /tmp/* 2>/dev/null || true
sync && echo 3 > /proc/sys/vm/drop_caches
echo -e "${GREEN}✅ Cache cleaned${NC}"
echo ""
free -h
echo ""

# ========================================================================
# INSTALL DEPENDENCIES
# ========================================================================
echo -e "${YELLOW}[5/9] Installing dependencies...${NC}"

# Use NODE_OPTIONS from .env.production or fallback
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1400}"
npm install --force --legacy-peer-deps
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# ========================================================================
# BUILD
# ========================================================================
echo -e "${YELLOW}[6/9] Building application (5-10 min)...${NC}"
export NODE_ENV=${NODE_ENV:-production}
# Optional: add extra options for V8
export NODE_OPTIONS="$NODE_OPTIONS --max-semi-space-size=32"

if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo ""
free -h
echo ""

# ========================================================================
# CREATE DIRS
# ========================================================================
echo -e "${YELLOW}[7/9] Creating directories...${NC}"
mkdir -p logs
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

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
