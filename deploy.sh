#!/bin/bash

# ========================================================================
# 🚀 COMPLETE DEPLOY — EMenu Owner Cambodia
# ========================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ "$EUID" -ne 0 ]; then
  echo -e "${RED}Run with: sudo bash deploy.sh${NC}"
  exit 1
fi

clear
echo -e "${BLUE}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          🚀 EMenu Owner Cambodia 🚀                       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

# ========================================================================
# [0/9] LOAD ENV
# ========================================================================
echo -e "${YELLOW}[0/9] Loading environment variables...${NC}"
export $(grep -v '^#' .env.production | xargs)
echo -e "${GREEN}✅ Environment loaded${NC}"
echo ""

# ========================================================================
# [1/9] SWAP CHECK (3GB)
# ========================================================================
echo -e "${YELLOW}[1/9] Checking swap...${NC}"
if ! swapon --show | grep -q swapfile; then
  fallocate -l 3G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo "/swapfile none swap sw 0 0" >> /etc/fstab
  echo -e "${GREEN}✅ Swap created${NC}"
else
  echo -e "${GREEN}✅ Swap already exists${NC}"
fi
free -h
echo ""

# ========================================================================
# [2/9] STOP PM2
# ========================================================================
echo -e "${YELLOW}[2/9] Stopping PM2...${NC}"
pm2 stop all || true
echo -e "${GREEN}✅ PM2 stopped${NC}"
echo ""

# ========================================================================
# [3/9] PULL CODE
# ========================================================================
echo -e "${YELLOW}[3/9] Pulling latest code (development)...${NC}"
git fetch origin
git reset --hard origin/development
echo -e "${GREEN}✅ Code updated${NC}"
echo ""

# ========================================================================
# [4/9] CLEAN CACHE
# ========================================================================
echo -e "${YELLOW}[4/9] Cleaning cache...${NC}"
rm -rf node_modules .next
npm cache clean --force
echo -e "${GREEN}✅ Cache cleaned${NC}"
free -h
echo ""

# ========================================================================
# [5/9] INSTALL DEPENDENCIES
# ========================================================================
echo -e "${YELLOW}[5/9] Installing dependencies...${NC}"
export NODE_OPTIONS="--max-old-space-size=1400"
npm install --legacy-peer-deps
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# ========================================================================
# [6/9] BUILD
# ========================================================================
echo -e "${YELLOW}[6/9] Building application (5–10 min)...${NC}"
npm run build
echo -e "${GREEN}✅ Build completed${NC}"
echo ""

# ========================================================================
# [7/9] PM2 CONFIG
# ========================================================================
echo -e "${YELLOW}[7/9] Creating PM2 config...${NC}"
cat > pm2.config.js << EOF
module.exports = {
  apps: [{
    name: "${APP_NAME}",
    script: "npm",
    args: "start",
    exec_mode: "fork",
    instances: 1,
    env_file: ".env.production",
    env: {
      NODE_ENV: "production",
      PORT: "${PORT}"
    },
    max_memory_restart: "900M",
    autorestart: true,
    restart_delay: 4000
  }]
};
EOF
echo -e "${GREEN}✅ PM2 config created${NC}"
echo ""

# ========================================================================
# [8/9] START PM2
# ========================================================================
echo -e "${YELLOW}[8/9] Starting application...${NC}"
pm2 start pm2.config.js
pm2 save
pm2 startup systemd -u root --hp /root || true
echo -e "${GREEN}✅ Application started${NC}"
echo ""

# ========================================================================
# [9/9] SUMMARY
# ========================================================================
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              🎉 DEPLOY SUCCESSFUL 🎉                     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""

pm2 status
free -h
