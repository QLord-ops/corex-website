#!/bin/bash

# Quick deploy script for corexdigital.de
# Usage: ./deploy.sh [vercel|vps]

set -e

DEPLOY_TYPE=${1:-vercel}

echo "🚀 Deploying corexdigital.de..."

if [ "$DEPLOY_TYPE" = "vercel" ]; then
    echo "📦 Building frontend..."
    cd frontend
    yarn install
    REACT_APP_API_URL=https://api.corexdigital.de yarn build
    echo "✅ Frontend built successfully"
    echo "📤 Deploy to Vercel:"
    echo "   cd frontend && vercel --prod"
    
elif [ "$DEPLOY_TYPE" = "vps" ]; then
    echo "🐳 Building with Docker..."
    docker-compose build
    docker-compose up -d
    echo "✅ Deployed with Docker Compose"
    
    echo "📦 Building frontend..."
    cd frontend
    yarn install
    REACT_APP_API_URL=https://api.corexdigital.de yarn build
    echo "✅ Frontend built"
    
    echo "📋 Next steps:"
    echo "   1. Copy frontend/build to /var/www/corexdigital.de/frontend/build"
    echo "   2. Configure nginx with nginx.conf"
    echo "   3. Run: sudo certbot --nginx -d corexdigital.de -d www.corexdigital.de"
else
    echo "❌ Unknown deploy type: $DEPLOY_TYPE"
    echo "Usage: ./deploy.sh [vercel|vps]"
    exit 1
fi

echo "✨ Done!"
