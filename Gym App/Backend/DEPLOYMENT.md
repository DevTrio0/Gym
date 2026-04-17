# Deployment Guide

Complete guide for deploying your Gym & Online Coaching API to production.

## Pre-Deployment Checklist

- [ ] Do you have a real database set up? (MongoDB, PostgreSQL, MySQL)
- [ ] Is the frontend ready? (React, Vue, Angular, etc.)
- [ ] Have you tested all API endpoints?
- [ ] Do you have SSL/HTTPS certificate?
- [ ] Have you set secure environment variables?
- [ ] Have you updated JWT_SECRET to a strong key?
- [ ] Have you configured CORS for your frontend domain?
- [ ] Have you set up email service for password resets?
- [ ] Have you integrated a payment gateway?
- [ ] Do you have monitoring and logging set up?

## Environment Variables for Production

Create `.env.production`:
```
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=your-super-long-random-secret-key-min-32-chars
JWT_EXPIRE=7d

# Database (Replace with your real database)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-coaching
# OR
DB_HOST=your-database-host
DB_USER=your-db-username
DB_PASS=your-db-password
DB_NAME=gym_coaching

# Email Service (for password resets)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL=noreply@yourgym.com

# Frontend URL (for CORS)
FRONTEND_URL=https://yourgym.com

# Payment Gateway (Stripe, PayPal, etc.)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...

# AWS/Cloud Storage (for storing workouts, images)
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=your-bucket

# Logging & Monitoring
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
```

## Update Configuration Files

### server.js - Production Ready
```javascript
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Routes
const coachRoutes = require('./routes/coachRoutes');
const adminRoutes = require('./routes/adminRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Logging
if (process.env.NODE_ENV === 'production') {
  const logger = require('./config/logger');
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Routes
app.use('/coach', coachRoutes);
app.use('/admin', adminRoutes);
app.use('/client', clientRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    // Don't expose error details in production
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  } else {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Deployment Platforms

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Procfile** (already created if using this skeleton)
```
web: node server.js
```

4. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
heroku create your-gym-api
heroku config:set JWT_SECRET="your-super-secret-key"
git push heroku main
```

5. **View logs**
```bash
heroku logs --tail
```

### Option 2: AWS EC2

1. **Launch EC2 Instance**
   - Choose Ubuntu 22.04
   - Configure security groups (allow ports 80, 443, 22)

2. **Connect and Setup**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
sudo apt update
sudo apt install nodejs npm git
```

3. **Clone and Deploy**
```bash
git clone your-repo
cd gym-coaching-api
npm install
npm start
```

4. **Use PM2 for Process Management**
```bash
npm install -g pm2
pm2 start server.js --name "gym-api"
pm2 save
pm2 startup
```

### Option 3: DigitalOcean

1. **Create Droplet** (Choose Node.js app)
2. **SSH into Droplet**
3. **Clone repository**
4. **Install dependencies**
5. **Configure Nginx as reverse proxy**

Example Nginx config:
```nginx
server {
    listen 80;
    server_name api.yourgym.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 4: Docker + Container Registry

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - MONGODB_URI=${MONGODB_URI}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
```

Deploy to Docker Hub:
```bash
docker build -t yourusername/gym-api:latest .
docker push yourusername/gym-api:latest
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d api.yourgym.com

# Auto-renew
sudo systemctl enable certbot.timer
```

### Update server.js for HTTPS
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/api.yourgym.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/api.yourgym.com/fullchain.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('Server running on HTTPS');
});
```

## Database Setup for Production

### MongoDB Atlas Cloud

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Save connection string to .env
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gym-coaching
```

### PostgreSQL on AWS RDS

1. Create RDS instance
2. Configure security groups
3. Update .env
```
DB_HOST=your-instance.xxxxx.us-east-1.rds.amazonaws.com
DB_USER=postgres
DB_PASS=your-password
DB_NAME=gym_coaching
```

## Monitoring & Logging

### Install Monitoring Tools

```bash
npm install winston sentry-node
```

Create `config/logger.js`:
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### Set up Sentry for Error Tracking
```bash
npm install @sentry/node
```

Update server.js:
```javascript
const Sentry = require('@sentry/node');

Sentry.init({ dsn: process.env.SENTRY_DSN });
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

## CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Heroku
        env:
          HEROKU_API_KEY: ${{ secrets.HEROKU_API_KEY }}
        run: |
          git remote add heroku https://git.heroku.com/your-gym-api.git
          git push heroku main
```

## Backup Strategy

### Daily Backups

```bash
# Create backup script: backup.sh
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri "mongodb+srv://..." --out ./backups/backup_$DATE
tar czf ./backups/backup_$DATE.tar.gz ./backups/backup_$DATE
aws s3 cp ./backups/backup_$DATE.tar.gz s3://your-backup-bucket/
```

## Performance Optimization

1. **Enable Gzip Compression**
```javascript
const compression = require('compression');
app.use(compression());
```

2. **Use Redis Caching**
```javascript
const redis = require('redis');
const client = redis.createClient();
```

3. **Add CDN for Static Assets**
   - CloudFlare (Free tier available)
   - AWS CloudFront

4. **Database Indexing**
   - Index: email, userId, coachId

5. **API Rate Limiting** - Already included

## Post-Deployment

1. **Health Checks**
```bash
curl https://api.yourgym.com/health
```

2. **Monitor Logs**
```bash
# Heroku
heroku logs --tail

# EC2/DigitalOcean
tail -f /var/log/app/combined.log
```

3. **Set up Alerts**
   - Sentry for errors
   - DataDog for performance
   - PagerDuty for critical issues

4. **API Documentation**
   - Deploy Swagger/OpenAPI docs
   - Keep README updated

## Rollback Plan

If deployment goes wrong:

```bash
# Heroku rollback
heroku releases
heroku rollback v1

# Git rollback
git revert <commit-hash>
git push
```

## Security Best Practices

✅ **Do:**
- Use HTTPS/SSL
- Keep dependencies updated
- Use environment variables for secrets
- Implement rate limiting
- Add input validation
- Use secure password hashing
- Enable CORS properly
- Log security events

❌ **Don't:**
- Expose error details
- Store passwords in code
- Use weak JWT secrets
- Skip SSL certificates
- Allow unlimited requests
- Trust user input
- Log sensitive data
- Hardcode API keys

## Monitoring Checklist

- [ ] Server CPU usage < 80%
- [ ] Memory usage < 80%
- [ ] Database response time < 100ms
- [ ] API response time < 200ms
- [ ] Error rate < 1%
- [ ] Uptime monitor running
- [ ] Daily backups working
- [ ] Security headers configured

## Useful Commands

```bash
# Check Node version
node --version

# Check npm packages for vulnerabilities
npm audit

# Check dependencies for updates
npm outdated

# Production build
NODE_ENV=production npm start

# View process logs
pm2 logs gym-api

# Monitor processes
pm2 monit
```

## Support & Troubleshooting

**API not responding?**
- Check server logs
- Verify environment variables
- Check database connection
- Check firewall rules

**Slow performance?**
- Add database indexes
- Enable caching
- Use CDN
- Monitor resource usage

**Database issues?**
- Check connection string
- Verify database credentials
- Check disk space
- Review slow query logs

For additional help, refer to the README.md and QUICKSTART.md files.
