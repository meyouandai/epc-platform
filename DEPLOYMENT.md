# EPC Platform Deployment Guide 🚀

This guide covers deploying the EPC Platform to production. The platform consists of a React frontend and Node.js backend with PostgreSQL database.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Stripe account for payments
- Domain name and SSL certificate
- Server with at least 2GB RAM

## Environment Setup

### 1. Database Setup

#### Local PostgreSQL
```bash
# Install PostgreSQL
brew install postgresql  # macOS
sudo apt install postgresql  # Ubuntu

# Create database
createdb epc_platform

# Run schema setup
cd server
node database/setup.js
```

#### Production Database (Recommended: Railway/Render/AWS RDS)
```bash
# Set DATABASE_URL environment variable
export DATABASE_URL="postgresql://user:password@host:port/database"
```

### 2. Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://localhost:5432/epc_platform

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Stripe (get from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Server
PORT=5001
NODE_ENV=production

# Optional: Use mock data for development
USE_MOCK_DATA=false
```

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Deployment Options

### Option 1: All-in-One Platform (Easiest)

#### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway init

# Deploy backend
cd server
railway up

# Deploy frontend
cd ../client
railway up

# Set environment variables in Railway dashboard
```

#### Render
```bash
# Create account at render.com
# Connect GitHub repository
# Create Web Service for backend (Node.js)
# Create Static Site for frontend (React)
```

### Option 2: Separate Services

#### Backend Deployment (Node.js)

**Heroku:**
```bash
# Install Heroku CLI
npm install -g heroku

# Create app
heroku create epc-platform-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set STRIPE_SECRET_KEY=sk_live_...

# Deploy
git push heroku main

# Run database setup
heroku run node server/database/setup.js
```

**DigitalOcean App Platform:**
```yaml
# app.yaml
name: epc-platform
services:
- name: api
  source_dir: /server
  github:
    repo: your-username/epc-platform
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: DATABASE_URL
    value: ${DATABASE_URL}
  - key: JWT_SECRET
    value: ${JWT_SECRET}
databases:
- engine: PG
  name: epc-db
  num_nodes: 1
  size: db-s-1vcpu-1gb
```

#### Frontend Deployment (React)

**Vercel (Recommended):**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd client
vercel

# Set environment variables in Vercel dashboard
```

**Netlify:**
```bash
# Build for production
cd client
npm run build

# Drag and drop 'build' folder to netlify.com
# Or connect GitHub repository
```

### Option 3: Self-Hosted (VPS)

```bash
# On your server (Ubuntu/CentOS)

# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs postgresql nginx certbot

# Clone repository
git clone https://github.com/your-username/epc-platform.git
cd epc-platform

# Install dependencies
npm run install-all

# Build frontend
cd client && npm run build

# Set up PostgreSQL
sudo -u postgres createdb epc_platform
sudo -u postgres psql -c "CREATE USER epc_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE epc_platform TO epc_user;"

# Run database setup
DATABASE_URL="postgresql://epc_user:secure_password@localhost:5432/epc_platform" node server/database/setup.js

# Set up environment variables
sudo nano /etc/environment

# Set up systemd service
sudo nano /etc/systemd/system/epc-platform.service
```

#### Systemd Service File
```ini
[Unit]
Description=EPC Platform API
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/epc-platform
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=5001
EnvironmentFile=/etc/environment

[Install]
WantedBy=multi-user.target
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Frontend
    location / {
        root /path/to/epc-platform/client/build;
        try_files $uri $uri/ /index.html;
    }

    # API
    location /api/ {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Post-Deployment Setup

### 1. SSL Certificate
```bash
# Using Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

### 2. Database Migration
```bash
# Run database setup
node server/database/setup.js
```

### 3. Stripe Configuration
1. Update webhook endpoint in Stripe dashboard
2. Set production API keys
3. Test payment flow

### 4. DNS Configuration
```
# A Records
your-domain.com -> your-server-ip
api.your-domain.com -> your-api-server-ip

# CNAME (if using CDN)
www.your-domain.com -> your-domain.com
```

### 5. Monitoring Setup

#### Health Checks
```bash
# Add to crontab
*/5 * * * * curl -f https://your-domain.com/api/health || echo "API is down" | mail -s "EPC Platform Alert" admin@your-domain.com
```

#### Log Monitoring
```bash
# Install log monitoring (optional)
npm install -g pm2
pm2 start server/index.js --name epc-platform
pm2 startup
pm2 save
```

## Security Checklist

- [ ] Environment variables are secure and not in code
- [ ] Database has restricted access
- [ ] API rate limiting is enabled
- [ ] HTTPS is enforced
- [ ] Stripe webhooks are verified
- [ ] JWT secrets are cryptographically secure
- [ ] CORS is properly configured
- [ ] Database backups are scheduled

## Testing Production

### API Endpoints
```bash
# Health check
curl https://your-domain.com/api/health

# Authentication
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@epcplatform.com","password":"password123"}'

# Protected endpoint
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-domain.com/api/admin/dashboard
```

### Frontend
1. Visit https://your-domain.com
2. Test login flows (admin and assessor)
3. Test dashboard functionality
4. Test payment processing

## Scaling Considerations

### Database
- Use connection pooling (already implemented)
- Consider read replicas for heavy read workloads
- Set up automated backups

### API
- Use PM2 cluster mode or multiple instances
- Implement Redis for session storage
- Add API caching for expensive operations

### Frontend
- Use CDN for static assets
- Implement service worker for offline functionality
- Add performance monitoring

## Backup Strategy

### Database Backups
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > "backup_${DATE}.sql"
# Upload to S3 or similar
```

### Code Backups
- Use Git with remote repository
- Tag releases for easy rollback
- Keep environment configs separate

## Troubleshooting

### Common Issues

**Database Connection Failed:**
```bash
# Check connection string
echo $DATABASE_URL
# Test connection
psql $DATABASE_URL -c "SELECT 1;"
```

**API Not Starting:**
```bash
# Check logs
journalctl -u epc-platform -f
# Check port availability
netstat -tlnp | grep 5001
```

**Frontend Build Fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Payment Processing Issues:**
- Verify Stripe webhook endpoint
- Check Stripe dashboard for errors
- Ensure correct API keys for environment

## Support

For deployment issues:
1. Check logs first
2. Verify environment variables
3. Test database connection
4. Check Stripe configuration
5. Contact support with specific error messages

## Production Login Credentials

**Admin Login:**
- Email: `admin@epcplatform.com`
- Password: `password123` (Change immediately!)

**Sample Assessor Login:**
- Email: `john@smithenergy.co.uk`
- Password: `password123`

Remember to change default passwords before going live! 🔐