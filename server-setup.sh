#!/bin/bash

# Portfolio Server Setup Script
# Run this on your server: 16.16.166.174

set -e

echo "🚀 Portfolio Server Setup Script"
echo "================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Step 2: Install Node.js
echo -e "${BLUE}📦 Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Step 3: Install Nginx
echo -e "${BLUE}📦 Installing Nginx...${NC}"
sudo apt install -y nginx

# Step 4: Install PM2
echo -e "${BLUE}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# Step 5: Create directories
echo -e "${BLUE}📁 Creating directories...${NC}"
sudo mkdir -p /var/www/portfolio
sudo mkdir -p /var/www/portfolio/backend
sudo mkdir -p /var/www/certbot

# Step 6: Set permissions
echo -e "${BLUE}🔒 Setting permissions...${NC}"
sudo chown -R $USER:$USER /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio

echo ""
echo -e "${GREEN}✅ Server setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Upload files:"
echo "   scp -r Frontend/build/* user@16.16.166.174:/var/www/portfolio/"
echo "   scp -r Backend/* user@16.16.166.174:/var/www/portfolio/backend/"
echo ""
echo "2. Upload and configure Nginx:"
echo "   scp nginx.conf user@16.16.166.174:/tmp/"
echo "   sudo mv /tmp/nginx.conf /etc/nginx/sites-available/portfolio"
echo "   sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/"
echo "   sudo nginx -t"
echo "   sudo systemctl restart nginx"
echo ""
echo "3. Start backend:"
echo "   cd /var/www/portfolio/backend"
echo "   npm install"
echo "   pm2 start server.js --name portfolio-backend"
echo "   pm2 save"
echo "   pm2 startup"
echo ""
echo "4. Setup SSL:"
echo "   sudo apt install certbot python3-certbot-nginx -y"
echo "   sudo certbot --nginx -d jashank.dpdns.org"
