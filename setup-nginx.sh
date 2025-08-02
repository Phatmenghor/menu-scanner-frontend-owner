#!/bin/bash

# ========================================================================
# 🔧 CUSTOMIZABLE VARIABLES - CHANGE THESE FOR YOUR PROJECT
# ========================================================================
PROJECT_NAME="MENU Scanner App"
APP_NAME="menu-scanner"
SERVER_IP="152.42.219.13"
FRONTEND_PORT="8888"
BACKEND_PORT="8080"
PM2_INTERNAL_PORT="2200"
MAX_UPLOAD_SIZE="50M"
PROXY_TIMEOUT="90s"

# ========================================================================
# 🔧 NGINX SETUP FOR KSIT MOBILE APP
# ========================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

# Load environment from .env.production
if [ -f .env.production ]; then
    source .env.production
    echo -e "${GREEN}✅ Environment loaded from .env.production${NC}"
    # Override with environment variables if they exist
    FRONTEND_PORT=${EXTERNAL_PORT:-$FRONTEND_PORT}
    PM2_INTERNAL_PORT=${PORT:-$PM2_INTERNAL_PORT}
else
    echo -e "${RED}❌ .env.production file not found!${NC}"
    exit 1
fi

clear

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  🔧 SETUP NGINX FOR ${PROJECT_NAME^^} 🔧                      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root or with sudo${NC}"
    echo -e "${YELLOW}Usage: sudo ./setup-nginx.sh${NC}"
    exit 1
fi

echo -e "${CYAN}📋 Configuration:${NC}"
echo -e "${CYAN}   Project: ${BOLD}${PROJECT_NAME}${NC}"
echo -e "${CYAN}   App Name: ${BOLD}${APP_NAME}${NC}"
echo -e "${CYAN}   Server IP: ${BOLD}${SERVER_IP}${NC}"
echo -e "${CYAN}   Frontend Port: ${BOLD}${FRONTEND_PORT}${NC}"
echo -e "${CYAN}   Backend Port: ${BOLD}${BACKEND_PORT}${NC}"
echo -e "${CYAN}   PM2 Internal Port: ${BOLD}${PM2_INTERNAL_PORT}${NC}"

echo -e "${CYAN}🔧 Setting up nginx configuration...${NC}"

# Remove old configs
echo -e "${YELLOW}🔍 Removing old nginx configs...${NC}"
rm -f /etc/nginx/conf.d/${APP_NAME}*.conf

# Create nginx configuration
cat > /etc/nginx/conf.d/${APP_NAME}.conf << NGINXEOF
# ${PROJECT_NAME} - Frontend + API Proxy
# Frontend: http://${SERVER_IP}:${FRONTEND_PORT}
# API: http://${SERVER_IP}:${FRONTEND_PORT}/api/* -> http://${SERVER_IP}:${BACKEND_PORT}/

upstream ${APP_NAME}_backend {
    server ${SERVER_IP}:${BACKEND_PORT} max_fails=3 fail_timeout=30s;
    keepalive 32;
}

upstream ${APP_NAME}_frontend {
    server 127.0.0.1:${PM2_INTERNAL_PORT} max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen ${FRONTEND_PORT};
    listen [::]:${FRONTEND_PORT};
    server_name _;
    client_max_body_size ${MAX_UPLOAD_SIZE};

    # Security headers
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-App "${APP_NAME}-${FRONTEND_PORT}" always;
    server_tokens off;

    # Connection settings
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_request_buffering off;
    proxy_connect_timeout ${PROXY_TIMEOUT};
    proxy_send_timeout ${PROXY_TIMEOUT};
    proxy_read_timeout ${PROXY_TIMEOUT};

    # API Proxy - Frontend calls http://${SERVER_IP}:${FRONTEND_PORT}/api/*
    # Proxied to backend: http://${SERVER_IP}:${BACKEND_PORT}/
    location /api/ {
        proxy_pass http://${APP_NAME}_backend/;
        
        # Standard proxy headers
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # CORS headers
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, X-Requested-With" always;
        add_header Access-Control-Allow-Credentials true always;
        
        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin *;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, X-Requested-With";
            add_header Access-Control-Allow-Credentials true;
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
        
        add_header X-API-Proxy "${APP_NAME}-backend-${BACKEND_PORT}" always;
    }

    # Static files and assets
    location ~* \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|css|js|map)\$ {
        proxy_pass http://${APP_NAME}_frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires 1h;
        add_header Cache-Control "public";
        add_header X-Static "${APP_NAME}-static-${PM2_INTERNAL_PORT}" always;
    }

    # Next.js static files
    location /_next/ {
        proxy_pass http://${APP_NAME}_frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires 5m;
        add_header Cache-Control "public";
        add_header X-Static "nextjs-${APP_NAME}-${PM2_INTERNAL_PORT}" always;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "${PROJECT_NAME} - Server ${SERVER_IP}:${FRONTEND_PORT} - OK\n";
        add_header Content-Type text/plain;
    }

    # Frontend pages
    location / {
        proxy_pass http://${APP_NAME}_frontend;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass \$http_upgrade;
        
        add_header X-Frontend "${APP_NAME}-frontend-${PM2_INTERNAL_PORT}" always;
    }
}
NGINXEOF

echo -e "${GREEN}✅ Nginx config created for ${APP_NAME}${NC}"

# Test and reload nginx
echo -e "${CYAN}🔍 Testing nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reloaded successfully${NC}"
else
    echo -e "${RED}❌ Nginx configuration has errors${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Nginx setup completed!${NC}"
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                           🌐 ACCESS INFORMATION                              ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${CYAN}🌐 Frontend URL: ${BOLD}http://${SERVER_IP}:${FRONTEND_PORT}${NC}"
echo -e "${CYAN}🔗 API Endpoint: ${BOLD}http://${SERVER_IP}:${FRONTEND_PORT}/api/*${NC}"
echo -e "${CYAN}🔗 Backend Direct: ${BOLD}http://${SERVER_IP}:${BACKEND_PORT}${NC}"
echo -e "${CYAN}🩺 Health Check: ${BOLD}http://${SERVER_IP}:${FRONTEND_PORT}/health${NC}"
echo -e "${CYAN}📊 Swagger: ${BOLD}http://${SERVER_IP}:${BACKEND_PORT}/swagger-ui/swagger-ui/index.html${NC}"
