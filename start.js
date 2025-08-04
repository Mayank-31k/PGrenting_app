const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting PG Renter Application...');

// Check if .env file exists
const fs = require('fs');
if (!fs.existsSync('.env')) {
  console.error('❌ .env file not found! Please copy .env.example to .env and configure your environment variables.');
  process.exit(1);
}

// Start the backend server
const server = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('error', (err) => {
  console.error('❌ Failed to start server:', err);
});

server.on('close', (code) => {
  console.log(`🔴 Server process exited with code ${code}`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🔴 Shutting down PG Renter Application...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🔴 Shutting down PG Renter Application...');
  server.kill('SIGTERM');
  process.exit(0);
});