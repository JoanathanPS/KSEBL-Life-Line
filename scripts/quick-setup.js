#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');

console.log('🚀 Kerala Emergency System - Quick Setup');
console.log('========================================\n');

// Step 1: Generate JWT secret
console.log('🔐 Generating JWT secret...');
const jwtSecret = crypto.randomBytes(32).toString('hex');

// Step 2: Create .env file
console.log('📝 Creating .env file...');
const envContent = `# Kerala Emergency System Configuration
NODE_ENV=development
PORT=5000
DATABASE_URL=file:./database/kerala_emergency.db
JWT_SECRET=${jwtSecret}
JWT_EXPIRES_IN=7d
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=demo@ksebl.gov.in
SMTP_PASSWORD=demo-password
SMTP_FROM=Kerala KSEBL Alerts <alerts@ksebl.gov.in>
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://localhost:5000
DEBUG=false
GENERATE_MOCK_DATA=true
`;

fs.writeFileSync('.env', envContent);
console.log('✅ .env file created');

// Step 3: Create directories
console.log('📁 Creating directories...');
const dirs = ['logs', 'uploads', 'server/ml', 'database'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  }
});

// Step 4: Create simple server
console.log('🖥️ Creating server...');
const serverContent = `const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock data
const mockData = {
  overview: {
    totalSubstations: 8,
    activeFeeders: 24,
    totalEventsToday: 4,
    activeEvents: 2,
    resolvedEvents: 2,
    modelAccuracy: 0.9687
  },
  recentEvents: [
    {
      id: '1',
      feederName: 'TVM-CENTRAL-F01',
      detectedAt: new Date().toISOString(),
      status: 'detected',
      severity: 'high',
      estimatedLocationKm: 2.5
    }
  ],
  alerts: { critical: 1, high: 2, medium: 1, low: 0 },
  performance: {
    avgDetectionTimeMs: 185,
    avgResponseTimeMinutes: 12.5,
    falsePositiveRate: 0.018
  }
};

// Routes
app.get('/api/v1/dashboard/summary', (req, res) => {
  res.json({ success: true, data: mockData });
});

app.get('/api/v1/dashboard/map-data', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      substations: [
        { id: '1', name: 'Thiruvananthapuram 132kV SS', code: 'TVM-132', lat: 8.5241, lng: 76.9361, voltageLevel: '132kV', capacityMva: 50, district: 'Thiruvananthapuram', status: 'operational' },
        { id: '2', name: 'Kochi 220kV SS', code: 'KCH-220', lat: 10.0168, lng: 76.3418, voltageLevel: '220kV', capacityMva: 100, district: 'Ernakulam', status: 'operational' },
        { id: '3', name: 'Thrissur 132kV SS', code: 'TSR-132', lat: 10.5276, lng: 76.2144, voltageLevel: '132kV', capacityMva: 75, district: 'Thrissur', status: 'operational' },
        { id: '4', name: 'Kozhikode 132kV SS', code: 'KZD-132', lat: 11.2588, lng: 75.7804, voltageLevel: '132kV', capacityMva: 60, district: 'Kozhikode', status: 'operational' }
      ]
    } 
  });
});

app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@ksebl.gov.in' && password === 'Admin@123') {
    res.json({
      success: true,
      data: {
        user: { id: '1', fullName: 'Admin User', email: 'admin@ksebl.gov.in', role: 'admin' },
        tokens: { accessToken: 'mock-token' }
      }
    });
  } else {
    res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' } });
  }
});

app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'Kerala Emergency System API is running' });
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
  console.log(\`📊 API: http://localhost:\${PORT}/api/v1\`);
  console.log(\`🔍 Health: http://localhost:\${PORT}/api/v1/health\`);
});
`;

fs.writeFileSync('server-simple.js', serverContent);
console.log('✅ Server created');

// Step 5: Update package.json
console.log('📦 Updating package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts['server:simple'] = 'node server-simple.js';
packageJson.scripts['dev:simple'] = 'npm run server:simple';
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Package.json updated');

console.log('\n🎉 Setup Complete!');
console.log('==================');
console.log('\n✅ Database configuration ready');
console.log('✅ Mock API server created');
console.log('✅ All directories created');
console.log('\n🚀 Start the system:');
console.log('   npm run dev:simple');
console.log('\n🌐 Then open:');
console.log('   http://localhost:5000');
console.log('\n🔑 Login with:');
console.log('   Email: admin@ksebl.gov.in');
console.log('   Password: Admin@123');
