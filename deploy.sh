#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Exit on any error
set -e

print_status "Starting deployment process for KSIT Mobile on port 8443..."

# Pull latest code from development branch
print_status "Pulling latest code from development branch..."
git pull origin development

# Install dependencies with force flag
print_status "Installing dependencies..."
npm i next --force

# Build the application
print_status "Building application..."
npm run build

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Stop existing PM2 process
print_status "Stopping existing PM2 process..."
pm2 stop ksit 2>/dev/null || true

# Delete existing PM2 process
print_status "Deleting existing PM2 process..."
pm2 delete ksit 2>/dev/null || true

# Create PM2 configuration file with port 8443
print_status "Creating PM2 configuration for port 8443..."
cat > pm2.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'ksit',
      script: 'npm',
      args: 'start',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: '8443',
        EXTERNAL_PORT: '8443'
      },
      env_file: '.env.production',
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      autorestart: true,
      kill_timeout: 5000,
      listen_timeout: 10000
    }
  ]
};
EOF

# Start PM2 process
print_status "Starting PM2 process on port 8443..."
pm2 start pm2.config.js

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

print_status "🎉 Deployment completed! App running on http://152.42.219.13:8443"

# Show PM2 status
print_status "Current PM2 status:"
pm2 status