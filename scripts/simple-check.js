#!/usr/bin/env node

/**
 * Simple Configuration Checker
 * Checks basic configuration without external dependencies
 */

const fs = require('fs');
const path = require('path');

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
    console.log('   Or run: npm run setup');
    return;
  }

  console.log('✅ .env file found\n');

  // Read .env file and check for placeholders
  const envContent = fs.readFileSync('.env', 'utf8');
  
  console.log('🔐 Checking configuration...');
  
  // Check for placeholder values
  const placeholders = [
    'your-email@gmail.com',
    'your-app-specific-password',
    'your-twilio-account-sid',
    'your-twilio-auth-token',
    'your-super-secret-jwt-key',
    'postgres:password@localhost'
  ];

  placeholders.forEach(placeholder => {
    if (envContent.includes(placeholder)) {
      warnings.push(`⚠️ Found placeholder value: ${placeholder}`);
    }
  });

  // Check for required variables
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'SMTP_HOST',
    'SMTP_USER',
    'SMTP_PASSWORD'
  ];

  requiredVars.forEach(varName => {
    if (!envContent.includes(`${varName}=`)) {
      issues.push(`❌ ${varName} is not defined`);
    } else {
      console.log(`✅ ${varName} is defined`);
    }
  });

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
    console.log('2. Run this checker again: node scripts/simple-check.js');
  } else {
    console.log('1. Run database setup: npm run db:push');
    console.log('2. Seed database: npm run db:seed');
    console.log('3. Start development: npm run dev');
  }

  console.log('\n📚 For detailed setup instructions, see SETUP-GUIDE.md');
  console.log('\n🔧 Quick setup commands:');
  console.log('   npm run setup          # Interactive setup');
  console.log('   npm run setup-windows  # Windows batch setup');
  console.log('   npm run check-config   # Check configuration');
}

// Run the checker
checkConfiguration();
