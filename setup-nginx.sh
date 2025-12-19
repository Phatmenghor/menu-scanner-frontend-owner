#!/bin/bash

#=============================================================================
# 🔧 NGINX SETUP SCRIPT - AUTO-CONFIGURED FROM .env.production
#=============================================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m'

clear

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                  🔧 SETUP NGINX FROM .env.production 🔧                      ║${NC}"
echo -e "${BLUE}║                   (Auto-configured from environment)                         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}❌ Please run as root or with sudo${NC}"
    echo -e "${YELLOW}Usage: sudo ./setup-nginx.sh${NC}"
    exit 1
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ .env.production file not found!${NC}"
    echo -e "${YELLOW}Please create .env.production with required variables${NC}"
    exit 1
fi

# Load environment variables
echo -e "${CYAN}📋 Loading configuration from .env.production...${NC}"
export $(grep -v '^#' .env.production | grep -v '^$' | xargs)

# Validate required variables
REQUIRED_VARS=(
    "APP_NAME"
    "EXTERNAL_PORT"
    "PORT"
    "NEXT_PUBLIC_API_BASE_URL"
    "BACKEND_API_URL"
    "NEXT_PUBLIC_API_BASE_URL_IMAGE"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${RED}❌ Missing required variables in .env.production:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo -e "${RED}   - $var${NC}"
    done
    exit 1
fi

# Set derived variables
INTERNAL_PORT=$PORT
PROJECT_DISPLAY_NAME="${APP_NAME^^} Mobile App"
PROJECT_DESCRIPTION="${APP_NAME^^} Institute Management System"

# Extract server IP from BACKEND_API_URL
SERVER_IP=$(echo $BACKEND_API_URL | sed 's|http://||' | sed 's|https://||' | cut -d: -f1)
BACKEND_PORT=$(echo $BACKEND_API_URL | sed 's|http://||' | sed 's|https://||' | cut -d: -f2 | cut -d/ -f1)

# Set defaults for optional variables
NGINX_CLIENT_MAX_BODY_SIZE="${NGINX_CLIENT_MAX_BODY_SIZE:-50M}"
NGINX_PROXY_TIMEOUT="${NGINX_PROXY_TIMEOUT:-90s}"
NGINX_KEEPALIVE_CONNECTIONS="${NGINX_KEEPALIVE_CONNECTIONS:-32}"
NGINX_MAX_FAILS="${NGINX_MAX_FAILS:-3}"
NGINX_FAIL_TIMEOUT="${NGINX_FAIL_TIMEOUT:-30s}"
STATIC_CACHE_TIME="${STATIC_CACHE_TIME:-1h}"
NEXTJS_CACHE_TIME="${NEXTJS_CACHE_TIME:-5m}"

echo -e "${GREEN}✅ Configuration loaded successfully${NC}"
echo ""
echo -e "${CYAN}📋 Project Configuration:${NC}"
echo -e "${CYAN}   App Name: ${BOLD}${APP_NAME}${NC}"
echo -e "${CYAN}   External Port: ${BOLD}${EXTERNAL_PORT}${NC}"
echo -e "${CYAN}   Internal Port: ${BOLD}${INTERNAL_PORT}${NC}"
echo -e "${CYAN}   Backend API: ${BOLD}${BACKEND_API_URL}${NC}"
echo -e "${CYAN}   Frontend API: ${BOLD}${NEXT_PUBLIC_API_BASE_URL}${NC}"
echo -e "${CYAN}   Server IP: ${BOLD}${SERVER_IP}${NC}"
echo -e "${CYAN}   Backend Port: ${BOLD}${BACKEND_PORT}${NC}"
echo ""

# Remove old configs
echo -e "${YELLOW}🔍 Removing old nginx configs...${NC}"
rm -f /etc/nginx/conf.d/${APP_NAME}*.conf
grep -l "${APP_NAME}" /etc/nginx/conf.d/*.conf 2>/dev/null | xargs rm -f 2>/dev/null || true

# Create nginx configuration
echo -e "${CYAN}🔧 Creating nginx configuration...${NC}"

cat > /etc/nginx/conf.d/${APP_NAME}.conf << EOF
# ${PROJECT_DISPLAY_NAME} - Frontend + API Proxy
# ${PROJECT_DESCRIPTION}
# Auto-generated from .env.production
# Frontend calls: http://${SERVER_IP}:${EXTERNAL_PORT}/api/* -> nginx proxy -> ${BACKEND_API_URL}/api/*

upstream ${APP_NAME}_backend_api {
    server ${SERVER_IP}:${BACKEND_PORT} max_fails=${NGINX_MAX_FAILS} fail_timeout=${NGINX_FAIL_TIMEOUT};
    keepalive ${NGINX_KEEPALIVE_CONNECTIONS};
}

upstream ${APP_NAME}_frontend_app {
    server 127.0.0.1:${INTERNAL_PORT} max_fails=${NGINX_MAX_FAILS} fail_timeout=${NGINX_FAIL_TIMEOUT};
    keepalive ${NGINX_KEEPALIVE_CONNECTIONS};
}

server {
    listen ${EXTERNAL_PORT};
    listen [::]:${EXTERNAL_PORT};
    server_name _;
    client_max_body_size ${NGINX_CLIENT_MAX_BODY_SIZE};

    # Security headers
    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-App "${PROJECT_DISPLAY_NAME}-${EXTERNAL_PORT}" always;
    server_tokens off;

    # Connection settings
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_request_buffering off;
    proxy_connect_timeout ${NGINX_PROXY_TIMEOUT};
    proxy_send_timeout ${NGINX_PROXY_TIMEOUT};
    proxy_read_timeout ${NGINX_PROXY_TIMEOUT};

    # CRITICAL: API Proxy - Frontend calls http://${SERVER_IP}:${EXTERNAL_PORT}/api/* 
    # This gets proxied to backend at ${BACKEND_API_URL}/api/*
    location /api/ {
        # Proxy to backend API server
        proxy_pass http://${APP_NAME}_backend_api/api/;
        
        # Standard proxy headers
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # CORS headers for API calls
        add_header Access-Control-Allow-Origin * always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
        add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, X-Requested-With, Origin" always;
        add_header Access-Control-Allow-Credentials true always;
        
        # Handle preflight requests
        if (\$request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin * always;
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS, PATCH" always;
            add_header Access-Control-Allow-Headers "Authorization, Content-Type, Accept, X-Requested-With, Origin" always;
            add_header Access-Control-Allow-Credentials true always;
            add_header Access-Control-Max-Age 86400 always;
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
        
        # Debug header to confirm API proxy
        add_header X-API-Proxy "${APP_NAME}-backend-${BACKEND_PORT}" always;
    }

    # Static files and assets - Serve from PM2 Next.js app
    location ~* \.(ico|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|css|js|map)\$ {
        proxy_pass http://${APP_NAME}_frontend_app;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires ${STATIC_CACHE_TIME};
        add_header Cache-Control "public";
        add_header X-Static "${APP_NAME}-static-${INTERNAL_PORT}" always;
    }

    # Next.js static files
    location /_next/ {
        proxy_pass http://${APP_NAME}_frontend_app;
        proxy_set_header Host \$host;
        proxy_set_header X-Forwarded-Proto \$scheme;
        expires ${NEXTJS_CACHE_TIME};
        add_header Cache-Control "public";
        add_header X-Static "nextjs-${APP_NAME}-static-${INTERNAL_PORT}" always;
    }

    # Health check endpoint
    location /health {
        access_log off;
        return 200 "${PROJECT_DISPLAY_NAME} - Server ${SERVER_IP} - External:${EXTERNAL_PORT} Internal:${INTERNAL_PORT} - OK\n";
        add_header Content-Type text/plain;
    }

    # Frontend pages - Serve from PM2 Next.js app
    location / {
        # Proxy to Next.js app running on PM2
        proxy_pass http://${APP_NAME}_frontend_app;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header X-Forwarded-Host \$host;
        proxy_set_header X-Forwarded-Port \$server_port;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_cache_bypass \$http_upgrade;
        
        # Debug header to confirm frontend proxy
        add_header X-Frontend "${APP_NAME}-frontend-${INTERNAL_PORT}" always;
    }
}
EOF

echo -e "${GREEN}✅ Nginx config created for ${APP_NAME}${NC}"

# Test and reload nginx
echo -e "${CYAN}🔍 Testing nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    systemctl reload nginx
    echo -e "${GREEN}✅ Nginx reloaded successfully${NC}"
else
    echo -e "${RED}❌ Nginx configuration has errors${NC}"
    echo -e "${YELLOW}Check the configuration file:${NC}"
    echo -e "${YELLOW}cat /etc/nginx/conf.d/${APP_NAME}.conf${NC}"
    exit 1
fi

# Show final status
echo ""
echo -e "${GREEN}🎉 Nginx setup completed for ${PROJECT_DISPLAY_NAME}!${NC}"
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                           🌐 ACCESS INFORMATION                              ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${CYAN}🌐 Application URLs:${NC}"
echo -e "${CYAN}  • Frontend: ${BOLD}http://${SERVER_IP}:${EXTERNAL_PORT}${NC}"
echo -e "${CYAN}  • Local: ${BOLD}http://localhost:${EXTERNAL_PORT}${NC}"
echo -e "${CYAN}🔗 API Endpoint: ${BOLD}${NEXT_PUBLIC_API_BASE_URL}${NC}"
echo -e "${CYAN}🔗 Backend Direct: ${BOLD}${BACKEND_API_URL}${NC}"
echo -e "${CYAN}🔗 Backend Images: ${BOLD}${NEXT_PUBLIC_API_BASE_URL_IMAGE}${NC}"
echo -e "${CYAN}🩺 Health Check: ${BOLD}http://${SERVER_IP}:${EXTERNAL_PORT}/health${NC}"
echo -e "${CYAN}📊 Swagger: ${BOLD}${BACKEND_API_URL}/swagger-ui/swagger-ui/index.html${NC}"
echo -e "${CYAN}🚀 PM2 App: ${BOLD}http://127.0.0.1:${INTERNAL_PORT}${NC}"

echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                              🔧 CONFIGURATION                                ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${CYAN}📁 Config file: ${BOLD}/etc/nginx/conf.d/${APP_NAME}.conf${NC}"
echo -e "${CYAN}🔍 Check config: ${BOLD}cat /etc/nginx/conf.d/${APP_NAME}.conf${NC}"
echo -e "${CYAN}🔄 Reload nginx: ${BOLD}sudo systemctl reload nginx${NC}"
echo -e "${CYAN}📊 Check nginx: ${BOLD}sudo systemctl status nginx${NC}"
echo -e "${CYAN}📋 Test config: ${BOLD}sudo nginx -t${NC}"

echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                            ⚡ API FLOW SUMMARY                               ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${YELLOW}1. Frontend (Next.js) makes API calls to: ${BOLD}http://${SERVER_IP}:${EXTERNAL_PORT}/api/v1/*${NC}"
echo -e "${YELLOW}2. Nginx receives request on port ${BOLD}${EXTERNAL_PORT}${NC}"
echo -e "${YELLOW}3. Nginx proxies /api/* requests to backend: ${BOLD}${BACKEND_API_URL}/api/*${NC}"
echo -e "${YELLOW}4. Nginx serves frontend pages from PM2: ${BOLD}127.0.0.1:${INTERNAL_PORT}${NC}"
echo -e "${YELLOW}5. Static files served through nginx proxy from PM2${NC}"
echo -e "${YELLOW}6. Images loaded from: ${BOLD}${NEXT_PUBLIC_API_BASE_URL_IMAGE}${NC}"

echo ""
echo -e "${PURPLE}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                          🧪 QUICK TESTS                                      ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${CYAN}# Test frontend:${NC}"
echo -e "  curl http://${SERVER_IP}:${EXTERNAL_PORT}"
echo ""
echo -e "${CYAN}# Test health check:${NC}"
echo -e "  curl http://${SERVER_IP}:${EXTERNAL_PORT}/health"
echo ""
echo -e "${CYAN}# Test API login:${NC}"
echo -e "  curl -X POST http://${SERVER_IP}:${EXTERNAL_PORT}/api/v1/auth/login \\"
echo -e "    -H 'Content-Type: application/json' \\"
echo -e "    -d '{\"username\":\"your@email.com\",\"password\":\"yourpass\"}'"
echo ""
echo -e "${GREEN}✅ Configuration completed! All settings loaded from .env.production${NC}"