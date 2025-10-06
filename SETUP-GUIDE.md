# 🚀 Kerala Line Break Detection System - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js (v18 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

## 🎯 Quick Start (Automated Setup)

### Step 1: Run the Configuration Script

```bash
# Make the script executable
chmod +x setup-config.js

# Run the automated setup
node setup-config.js
```

This script will:
- ✅ Generate secure JWT secrets
- ✅ Help configure database
- ✅ Set up email service
- ✅ Configure SMS (optional)
- ✅ Create .env file
- ✅ Set up directories
- ✅ Update API configuration

## 🔧 Manual Setup (Step by Step)

### Step 1: Environment Configuration

1. **Copy the template:**
   ```bash
   cp config-template.env .env
   ```

2. **Edit .env file with your values:**
   ```bash
   nano .env  # or use your preferred editor
   ```

### Step 2: Database Setup

#### Option A: Local PostgreSQL (Recommended for Development)

1. **Install PostgreSQL:**
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql postgresql-contrib`

2. **Create Database:**
   ```sql
   -- Connect to PostgreSQL
   psql -U postgres

   -- Create database
   CREATE DATABASE kerala_line_break;

   -- Create user (optional)
   CREATE USER ksebl_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE kerala_line_break TO ksebl_user;
   ```

3. **Update .env:**
   ```bash
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/kerala_line_break
   ```

#### Option B: Cloud PostgreSQL (Recommended for Production)

##### Neon (Free Tier Available)

1. **Sign up at [neon.tech](https://neon.tech)**
2. **Create a new project**
3. **Copy the connection string**
4. **Update .env:**
   ```bash
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

##### Supabase (Free Tier Available)

1. **Sign up at [supabase.com](https://supabase.com)**
2. **Create a new project**
3. **Go to Settings > Database**
4. **Copy the connection string**
5. **Update .env:**
   ```bash
   DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
   ```

### Step 3: Email Service Setup

#### Gmail SMTP (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate password for "Mail"
3. **Update .env:**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-16-character-app-password
   SMTP_FROM=Kerala KSEBL Alerts <alerts@ksebl.gov.in>
   ```

#### Outlook SMTP

1. **Enable SMTP** in Outlook settings
2. **Update .env:**
   ```bash
   SMTP_HOST=smtp-mail.outlook.com
   SMTP_PORT=587
   SMTP_USER=your-email@outlook.com
   SMTP_PASSWORD=your-password
   ```

### Step 4: SMS Service Setup (Optional)

#### Twilio Setup

1. **Sign up at [twilio.com](https://twilio.com)**
2. **Get credentials from Console:**
   - Account SID
   - Auth Token
   - Phone Number
3. **Update .env:**
   ```bash
   TWILIO_ACCOUNT_SID=your-account-sid
   TWILIO_AUTH_TOKEN=your-auth-token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### Step 5: Install Dependencies

```bash
# Install all dependencies
npm install

# Or with yarn
yarn install
```

### Step 6: Database Migration

```bash
# Push database schema
npm run db:push

# Seed with sample data
npm run db:seed
```

### Step 7: Start Development

```bash
# Start development server
npm run dev

# Or start individually
npm run server:dev  # Backend only
npm run client:dev  # Frontend only
```

## 🌐 Production Deployment

### Step 1: Update Production URLs

1. **Update API Base URL** in `client/src/api/client.ts`:
   ```typescript
   const API_BASE_URL = 'https://your-api-domain.com/api/v1';
   ```

2. **Update Frontend URL** in `.env`:
   ```bash
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Update CORS Origins** in `.env`:
   ```bash
   ALLOWED_ORIGINS=https://your-frontend-domain.com,https://your-api-domain.com
   ```

### Step 2: Environment Variables for Production

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=your-production-database-url
JWT_SECRET=your-super-secure-production-secret
SMTP_HOST=your-production-smtp-host
SMTP_USER=your-production-email
SMTP_PASSWORD=your-production-email-password
```

### Step 3: Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

## 🔧 Advanced Configuration

### Map Configuration

#### Using Mapbox (Recommended for Production)

1. **Sign up at [mapbox.com](https://mapbox.com)**
2. **Get your access token**
3. **Update map tiles in `index.html` line 308:**
   ```javascript
   L.tileLayer('https://api.mapbox.com/styles/v1/your-username/your-style-id/tiles/{z}/{x}/{y}?access_token=YOUR_MAPBOX_TOKEN', {
       attribution: '© Mapbox'
   }).addTo(map);
   ```

### Real Data Integration

#### Replace Mock Data

1. **Update emergency data** in `index.html` (lines 405-420)
2. **Connect to real SCADA systems**
3. **Implement WebSocket for real-time updates**
4. **Add real Kerala grid coordinates**

### Machine Learning Model

1. **Train your model:**
   ```bash
   python scripts/train-model.py
   ```

2. **Update model path in .env:**
   ```bash
   TENSORFLOW_MODEL_PATH=./server/ml/model.json
   ```

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed:**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify credentials

2. **Email Not Sending:**
   - Check SMTP credentials
   - Verify app password (Gmail)
   - Check firewall settings

3. **Map Not Loading:**
   - Check internet connection
   - Verify Leaflet CDN links
   - Check browser console for errors

4. **API Errors:**
   - Check CORS configuration
   - Verify API base URL
   - Check authentication tokens

### Debug Mode

Enable debug logging:
```bash
DEBUG=true npm run dev
```

## 📞 Support

If you encounter issues:

1. **Check logs** in `./logs/app.log`
2. **Enable debug mode** with `DEBUG=true`
3. **Check browser console** for frontend errors
4. **Verify all environment variables** are set correctly

## 🔐 Security Checklist

- [ ] JWT secret is 32+ characters
- [ ] Database credentials are secure
- [ ] Email passwords are app-specific
- [ ] CORS origins are restricted
- [ ] Rate limiting is enabled
- [ ] HTTPS is used in production
- [ ] .env file is in .gitignore

## 📈 Performance Optimization

1. **Enable Redis caching** (optional)
2. **Use CDN for static assets**
3. **Optimize database queries**
4. **Enable compression**
5. **Use production build**

---

## 🎉 You're All Set!

Your Kerala Line Break Detection System is now configured and ready to use!

**Next Steps:**
1. Test the application locally
2. Configure real data sources
3. Deploy to production
4. Set up monitoring

**Remember to:**
- Keep your .env file secure
- Regularly update dependencies
- Monitor system performance
- Backup your database regularly
