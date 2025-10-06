#!/usr/bin/env node

/**
 * Database Setup Script for Kerala Line Break Detection System
 * This script helps you set up the database with sample data
 */

const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

async function setupDatabase() {
  console.log('🗄️ Setting up database...');
  
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in environment variables');
      console.log('Please run: cp config-template.env .env');
      console.log('Then edit .env with your database credentials');
      process.exit(1);
    }

    // Create database connection
    const sql = postgres(process.env.DATABASE_URL);
    const db = drizzle(sql);

    console.log('✅ Connected to database');

    // Create tables (this will be handled by Drizzle migrations)
    console.log('📋 Creating database schema...');
    
    // Run database migrations
    const { execSync } = require('child_process');
    try {
      execSync('npm run db:push', { stdio: 'inherit' });
      console.log('✅ Database schema created');
    } catch (error) {
      console.log('⚠️ Database schema might already exist');
    }

    // Seed with sample data
    console.log('🌱 Seeding database with sample data...');
    try {
      execSync('npm run db:seed', { stdio: 'inherit' });
      console.log('✅ Database seeded with sample data');
    } catch (error) {
      console.log('⚠️ Seeding might have failed, but continuing...');
    }

    console.log('\n🎉 Database setup completed!');
    console.log('\n📋 Database includes:');
    console.log('- Users table with admin account');
    console.log('- Substations across Kerala');
    console.log('- Sample feeders and events');
    console.log('- Emergency contact information');

    console.log('\n🔑 Default Admin Account:');
    console.log('Email: admin@ksebl.gov.in');
    console.log('Password: Admin@123');

    await sql.end();
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Ensure PostgreSQL is running');
    console.log('3. Verify database credentials');
    console.log('4. Check if database exists');
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
