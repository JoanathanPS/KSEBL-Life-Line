#!/usr/bin/env node

/**
 * Configuration Checker for Kerala Line Break Detection System
 * This script validates your configuration and provides setup guidance
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

function checkConfiguration() {
  console.log('🔍 Kerala Line Break Detection System - Configuration Checker');
  console.log('============================================================\n');

  const issues = [];
  const warnings = [];
  const recommendations = [];

  // Check if .env file exists
  if (!fs.existsSync('.env')) {
    issues.push('❌ .env file not found');
    console.log('💡 Solution: Run "cp config-template.env .env" and edit the file');
    return;
  }

  console.log('✅ .env file found\n');

  // Check required environment variables
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASSWORD'
  ];

  console.log('🔐 Checking required environment variables...');
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      issues.push(`❌ ${varName} is not set`);
    } else if (process.env[varName].includes('your-') || process.env[varName].includes('password')) {
      warnings.push(`⚠️ ${varName} appears to be a placeholder value`);
    } else {
      console.log(`✅ ${varName} is configured`);
    }
  });

  // Check JWT secret strength
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      issues.push('❌ JWT_SECRET should be at least 32 characters long');
    } else {
      console.log('✅ JWT_SECRET is sufficiently long');
    }
  }

  // Check database URL format
  if (process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL.startsWith('postgresql://')) {
      issues.push('❌ DATABASE_URL should start with "postgresql://"');
    } else {
      console.log('✅ DATABASE_URL format looks correct');
    }
  }

  // Check email configuration
  if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    if (process.env.SMTP_USER.includes('@gmail.com')) {
      recommendations.push('💡 For Gmail, make sure you\'re using an App Password, not your regular password');
    }
    console.log('✅ Email configuration found');
  }

  // Check optional services
  console.log('\n📱 Checking optional services...');
  
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    console.log('✅ SMS service (Twilio) configured');
  } else {
    warnings.push('⚠️ SMS service not configured (optional)');
  }

  if (process.env.OPENAI_API_KEY) {
    console.log('✅ OpenAI API key configured');
  } else {
    warnings.push('⚠️ OpenAI API key not configured (optional)');
  }

  // Check file structure
  console.log('\n📁 Checking file structure...');
  const requiredDirs = ['logs', 'uploads', 'server/ml'];
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      warnings.push(`⚠️ Directory ${dir} does not exist`);
    } else {
      console.log(`✅ Directory ${dir} exists`);
    }
  });

  // Check package.json
  if (fs.existsSync('package.json')) {
    console.log('✅ package.json found');
  } else {
    issues.push('❌ package.json not found');
  }

  // Check if node_modules exists
  if (fs.existsSync('node_modules')) {
    console.log('✅ Dependencies installed');
  } else {
    issues.push('❌ Dependencies not installed. Run "npm install"');
  }

  // Summary
  console.log('\n📊 Configuration Summary');
  console.log('========================');

  if (issues.length === 0) {
    console.log('🎉 All required configurations are set!');
  } else {
    console.log(`❌ Found ${issues.length} critical issues:`);
    issues.forEach(issue => console.log(`   ${issue}`));
  }

  if (warnings.length > 0) {
    console.log(`\n⚠️ Found ${warnings.length} warnings:`);
    warnings.forEach(warning => console.log(`   ${warning}`));
  }

  if (recommendations.length > 0) {
    console.log(`\n💡 Recommendations:`);
    recommendations.forEach(rec => console.log(`   ${rec}`));
  }

  // Next steps
  console.log('\n🚀 Next Steps:');
  if (issues.length > 0) {
    console.log('1. Fix the critical issues above');
    console.log('2. Run this checker again: node scripts/check-config.js');
  } else {
    console.log('1. Run database setup: npm run db:push');
    console.log('2. Seed database: npm run db:seed');
    console.log('3. Start development: npm run dev');
  }

  console.log('\n📚 For detailed setup instructions, see SETUP-GUIDE.md');
}

// Run the checker
checkConfiguration();
