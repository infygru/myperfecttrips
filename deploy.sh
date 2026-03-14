#!/bin/bash
# =============================================================================
# MyPerfectTrips — VPS Deployment Script (Hostinger KVM2)
# Run this on the VPS after SSH-ing in.
# Usage: bash deploy.sh
# =============================================================================

set -e  # Exit on any error

APP_DIR="/var/www/myperfecttrips"
REPO_URL="git@github.com:YOUR_GITHUB_USERNAME/myperfecttrips.git"  # Update this
BRANCH="main"

echo "=============================="
echo " MyPerfectTrips Deploy Script"
echo "=============================="

# Check if this is first deploy or update
if [ -d "$APP_DIR/.git" ]; then
    echo "[1/5] Pulling latest code from GitHub..."
    cd "$APP_DIR"
    git fetch origin
    git reset --hard origin/$BRANCH
    git pull origin $BRANCH
else
    echo "[1/5] Cloning repository for first time..."
    git clone -b $BRANCH $REPO_URL $APP_DIR
    cd "$APP_DIR"
fi

echo "[2/5] Copying production environment file..."
if [ ! -f "$APP_DIR/.env.production" ]; then
    echo "ERROR: .env.production not found! Please create it from .env.production.example"
    exit 1
fi

echo "[3/5] Installing dependencies..."
npm ci --production=false

echo "[4/5] Building Next.js application..."
NODE_ENV=production npm run build

echo "[5/5] Restarting application..."
if command -v docker &> /dev/null && [ -f "$APP_DIR/docker-compose.yml" ]; then
    echo "Using Docker Compose..."
    docker compose pull
    docker compose up -d --build --remove-orphans
    docker compose ps
else
    echo "Using PM2..."
    if ! command -v pm2 &> /dev/null; then
        npm install -g pm2
    fi
    pm2 startOrRestart ecosystem.config.js --env production
    pm2 save
fi

echo ""
echo "=============================="
echo " Deployment Complete!"
echo " Site: https://myperfecttrips.com"
echo "=============================="
