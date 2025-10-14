# 🚀 Production Setup Guide - jashank.dpdns.org

## ✅ Issues Fixed

### 1. CORS Error - Fixed! ✅
**Backend** now allows:
- `http://jashank.dpdns.org`
- `https://jashank.dpdns.org`
- `http://16.16.166.174`
- All localhost origins

### 2. API URL - Fixed! ✅
**Frontend** now uses:
- Production: `http://16.16.166.174:5000`
- Local development: `http://localhost:5001`

### 3. Logo Missing - Fixed! ✅
Logo files already present in `/Frontend/public/`:
- `Logo.mp4` ✅
- `Logo.png` ✅

---

## 📋 Setup Steps

### Step 1: Build Frontend for Production

```bash
cd /Users/Jay/Documents/Portfolio/Frontend

# Build with production env
npm run build

# This will use .env.production file
# API URL: http://16.16.166.174:5000
```

### Step 2: Deploy to Server (16.16.166.174)

```bash
# SSH to your server
ssh user@16.16.166.174

# Create directories
mkdir -p /var/www/portfolio
mkdir -p /var/www/portfolio/backend

# Upload files
# From local machine:
scp -r Frontend/build/* user@16.16.166.174:/var/www/portfolio/
scp -r Backend/* user@16.16.166.174:/var/www/portfolio/backend/
```

### Step 3: Install Nginx on Server

```bash
# On server
sudo apt update
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/portfolio
```

**Nginx Configuration (HTTP):**
```nginx
server {
    listen 80;
    server_name jashank.dpdns.org 16.16.166.174;
    
    # Frontend
    root /var/www/portfolio;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 4: Setup HTTPS with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d jashank.dpdns.org

# Follow prompts:
# - Enter email
# - Agree to terms
# - Redirect HTTP to HTTPS: Yes
```

**After Certbot, Nginx config will update automatically:**
```nginx
server {
    listen 443 ssl http2;
    server_name jashank.dpdns.org;
    
    ssl_certificate /etc/letsencrypt/live/jashank.dpdns.org/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jashank.dpdns.org/privkey.pem;
    
    # ... rest of config ...
}

server {
    listen 80;
    server_name jashank.dpdns.org;
    return 301 https://$server_name$request_uri;
}
```

### Step 5: Start Backend Server

```bash
# Install PM2 for process management
sudo npm install -g pm2

# Start backend
cd /var/www/portfolio/backend
npm install
pm2 start server.js --name portfolio-backend

# Save PM2 config
pm2 save
pm2 startup
```

### Step 6: Update Frontend API URL for HTTPS

After HTTPS is setup, update:

**Frontend/.env.production:**
```env
REACT_APP_API_URL=https://jashank.dpdns.org
PUBLIC_URL=https://jashank.dpdns.org
```

**Rebuild and redeploy:**
```bash
npm run build
# Upload build folder again
```

---

## 🔧 Alternative: Using Docker on Server

### Option 1: Deploy with Docker Compose

```bash
# On server
cd /var/www/portfolio

# Pull images from Docker Hub
docker pull jashank06/portfolio-frontend:latest
docker pull jashank06/portfolio-backend:latest

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  backend:
    image: jashank06/portfolio-backend:latest
    ports:
      - "5000:5001"
    environment:
      - PORT=5001
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    image: jashank06/portfolio-frontend:latest
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
EOF

# Start containers
docker-compose up -d
```

---

## 🌐 DNS Configuration

### Update DNS for jashank.dpdns.org

1. **Login to dpdns.org control panel**
2. **Update A Record:**
   ```
   Type: A
   Name: jashank
   Value: 16.16.166.174
   TTL: 3600
   ```

3. **Wait for DNS propagation** (5-30 minutes)

4. **Verify:**
   ```bash
   # Check DNS
   nslookup jashank.dpdns.org
   
   # Should return: 16.16.166.174
   ```

---

## 🔍 Troubleshooting

### Logo Still Not Loading?

```bash
# Check if files exist on server
ls -la /var/www/portfolio/*.png
ls -la /var/www/portfolio/*.mp4

# Check Nginx permissions
sudo chown -R www-data:www-data /var/www/portfolio
sudo chmod -R 755 /var/www/portfolio
```

### CORS Errors Persist?

```bash
# Check backend logs
pm2 logs portfolio-backend

# Restart backend
pm2 restart portfolio-backend

# Check if backend is running
curl http://localhost:5000/health
```

### SSL Certificate Issues?

```bash
# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Check certificate
sudo certbot certificates
```

---

## 📊 Monitoring

### Check Services Status

```bash
# Nginx
sudo systemctl status nginx

# Backend (PM2)
pm2 status

# Docker (if using)
docker ps
docker-compose logs -f
```

### View Logs

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Backend logs
pm2 logs portfolio-backend
```

---

## 🚀 Quick Deployment Script

Create this script on your server:

**deploy.sh:**
```bash
#!/bin/bash

echo "🚀 Deploying Portfolio..."

# Pull latest images
docker-compose pull

# Restart services
docker-compose down
docker-compose up -d

# Check status
docker-compose ps

echo "✅ Deployment complete!"
echo "Frontend: https://jashank.dpdns.org"
echo "Backend: https://jashank.dpdns.org/api/health"
```

```bash
chmod +x deploy.sh
./deploy.sh
```

---

## ✅ Final Checklist

- [ ] Frontend built with production env
- [ ] Backend CORS updated for domain
- [ ] Files uploaded to server
- [ ] Nginx installed and configured
- [ ] SSL certificate obtained
- [ ] Backend running on port 5000
- [ ] DNS pointing to server IP
- [ ] Logo files in place
- [ ] API calls working
- [ ] HTTPS redirect working

---

## 🔗 URLs

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | https://jashank.dpdns.org | ✅ |
| **Backend API** | https://jashank.dpdns.org/api | ✅ |
| **Health Check** | https://jashank.dpdns.org/api/health | ✅ |

---

## 📞 Support

Server Details:
- IP: `16.16.166.174`
- Domain: `jashank.dpdns.org`
- Backend Port: `5000`
- Frontend Port: `80` (HTTP) / `443` (HTTPS)

---

**Last Updated:** October 2025
**Status:** Ready for Production 🚀
