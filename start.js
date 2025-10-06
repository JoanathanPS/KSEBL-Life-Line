#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Kerala Line Break Detection System...\n');

// Build the client first
console.log('📦 Building React frontend...');
const buildProcess = spawn('npm', ['run', 'build:client'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

buildProcess.on('close', (code) => {
  if (code !== 0) {
    console.error('❌ Frontend build failed');
    process.exit(1);
  }
  
  console.log('✅ Frontend built successfully\n');
  
  // Start the server
  console.log('🔧 Starting Express server...');
  const serverProcess = spawn('tsx', ['server/index.ts'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });
  
  serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    serverProcess.kill('SIGINT');
    process.exit(0);
  });
});
