# 🚀 Kerala LT Line Break Detection System - Deployment Guide

## Quick Deploy to Vercel

### 1. Prerequisites
- Vercel account
- Supabase project
- Environment variables configured

### 2. Deploy Steps

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add JWT_SECRET
vercel env add JWT_REFRESH_SECRET
# ... add all other env vars from env.example

# Redeploy with env vars
vercel --prod
```

### 3. Environment Variables Required

Copy from `env.example` and set in Vercel dashboard:

```bash
# Database
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# SMS (Optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### 4. Database Setup

```bash
# Run migrations
npm run db:push

# Seed database
npm run db:seed

# Generate ML dataset
python scripts/generate-dataset.py

# Train ML model
python scripts/train-model.py
```

### 5. Production URLs

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/v1`

### 6. Health Check

```bash
curl https://your-app.vercel.app/api/v1/health
```

## Manual Deployment

### 1. Build Application

```bash
npm run build
```

### 2. Start Production Server

```bash
npm start
```

### 3. Configure Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

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

## Monitoring & Maintenance

### 1. Logs
- Check Vercel function logs
- Monitor Supabase logs
- Set up error tracking (Sentry)

### 2. Performance
- Monitor API response times
- Check database query performance
- Optimize ML model inference

### 3. Security
- Regular security updates
- Monitor for vulnerabilities
- Review access logs

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check Supabase credentials
   - Verify network connectivity
   - Check RLS policies

2. **ML Model Not Loading**
   - Verify model files exist
   - Check file permissions
   - Review model format

3. **Authentication Issues**
   - Verify JWT secrets
   - Check token expiration
   - Review user permissions

### Support

For deployment issues, check:
- Vercel documentation
- Supabase documentation
- Project README.md
