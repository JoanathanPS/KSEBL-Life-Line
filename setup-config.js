 #!/usr/bin/env node

/**
 * Kerala Line Break Detection System - Configuration Setup Script
 * This script helps you set up all required configurations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

console.log('🚀 Kerala Line Break Detection System - Configuration Setup');
console.log('========================================================\n');

async function setupConfiguration() {
  try {
    // Step 1: Generate JWT Secret
    console.log('🔐 Step 1: Generating JWT Secret...');
    const jwtSecret = crypto.randomBytes(32).toString('hex');
    console.log(`✅ Generated JWT Secret: ${jwtSecret}\n`);

    // Step 2: Database Configuration
    console.log('🗄️ Step 2: Database Configuration');
    console.log('Choose your database option:');
    console.log('1. Local PostgreSQL (requires local installation)');
    console.log('2. Neon (free cloud PostgreSQL)');
    console.log('3. Supabase (free cloud PostgreSQL)');
    console.log('4. Skip for now');
    
    const dbChoice = await question('Enter your choice (1-4): ');
    
    let databaseUrl = 'postgresql://postgres:password@localhost:5432/kerala_line_break';
    
    switch(dbChoice) {
      case '2':
        const neonUrl = await question('Enter your Neon database URL: ');
        databaseUrl = neonUrl;
        break;
      case '3':
        const supabaseUrl = await question('Enter your Supabase database URL: ');
        databaseUrl = supabaseUrl;
        break;
      case '4':
        console.log('⏭️ Skipping database configuration');
        break;
      default:
        console.log('📝 Using local PostgreSQL configuration');
    }

    // Step 3: Email Configuration
    console.log('\n📧 Step 3: Email Service Configuration');
    const emailService = await question('Enter your email address: ');
    const emailPassword = await question('Enter your email app password: ');
    
    // Step 4: SMS Configuration (Optional)
    console.log('\n📱 Step 4: SMS Service Configuration (Optional)');
    const useSMS = await question('Do you want to set up SMS notifications? (y/n): ');
    
    let twilioConfig = '';
    if (useSMS.toLowerCase() === 'y') {
      const accountSid = await question('Enter Twilio Account SID: ');
      const authToken = await question('Enter Twilio Auth Token: ');
      const phoneNumber = await question('Enter Twilio Phone Number: ');
      twilioConfig = `
TWILIO_ACCOUNT_SID=${accountSid}
TWILIO_AUTH_TOKEN=${authToken}
TWILIO_PHONE_NUMBER=${phoneNumber}`;
    }

    // Step 5: Generate .env file
    console.log('\n📝 Step 5: Generating .env file...');
    
    const envContent = `# ===========================================
# KERALA LINE BREAK DETECTION SYSTEM
# Environment Variables Configuration
# ===========================================
# Generated on ${new Date().toISOString()}

# ===========================================
# SERVER CONFIGURATION
# ===========================================
NODE_ENV=development
PORT=5000
API_VERSION=v1
FRONTEND_URL=http://localhost:5173

# ===========================================
# DATABASE CONFIGURATION
# ===========================================
DATABASE_URL=${databaseUrl}

# ===========================================
# JWT CONFIGURATION
# ===========================================
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# ===========================================
# EMAIL SERVICE (SMTP)
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=${emailService}
SMTP_PASSWORD=${emailPassword}
SMTP_FROM=Kerala KSEBL Alerts <alerts@ksebl.gov.in>
SMTP_SECURE=false

# ===========================================
# SMS SERVICE (Twilio)${twilioConfig}

# ===========================================
# CORS CONFIGURATION
# ===========================================
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:5000

# ===========================================
# RATE LIMITING
# ===========================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ===========================================
# WEBSOCKET CONFIGURATION
# ===========================================
WEBSOCKET_PORT=8080
WEBSOCKET_PATH=/ws

# ===========================================
# KERALA GRID SPECIFIC
# ===========================================
GRID_VOLTAGE_LEVEL=11000
TYPICAL_FREQUENCY=50
SAMPLING_RATE=10000
DETECTION_THRESHOLD=0.85

# ===========================================
# DEVELOPMENT
# ===========================================
DEBUG=false
GENERATE_MOCK_DATA=true`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file created successfully!');

    // Step 6: Create necessary directories
    console.log('\n📁 Step 6: Creating necessary directories...');
    const dirs = ['logs', 'uploads', 'server/ml'];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    });

    // Step 7: Generate API configuration
    console.log('\n🔧 Step 7: Updating API configuration...');
    updateAPIConfiguration();

    console.log('\n🎉 Configuration setup completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Install dependencies: npm install');
    console.log('2. Set up database: npm run db:push');
    console.log('3. Seed database: npm run db:seed');
    console.log('4. Start development: npm run dev');
    console.log('\n⚠️  Remember to:');
    console.log('- Never commit .env file to version control');
    console.log('- Update production URLs before deployment');
    console.log('- Test email and SMS services');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
  } finally {
    rl.close();
  }
}

function updateAPIConfiguration() {
  // Update API base URL for production
  const apiClientPath = 'client/src/api/client.ts';
  if (fs.existsSync(apiClientPath)) {
    let content = fs.readFileSync(apiClientPath, 'utf8');
    
    // Add production API URL configuration
    const productionConfig = `
// Production API URL - Update this for production deployment
const PRODUCTION_API_URL = 'https://your-api-domain.com/api/v1';
const API_BASE_URL = process.env.NODE_ENV === 'production' ? PRODUCTION_API_URL : '/api/v1';`;
    
    content = content.replace(
      'const API_BASE_URL = \'/api/v1\';',
      productionConfig
    );
    
    fs.writeFileSync(apiClientPath, content);
    console.log('✅ Updated API configuration');
  }
}

// Run the setup
setupConfiguration();
