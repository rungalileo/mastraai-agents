#!/usr/bin/env node

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

/**
 * Galileo Setup Test
 * 
 * This script helps you test your Galileo configuration
 * and verify that everything is set up correctly.
 */

console.log('🔍 Galileo Setup Test');
console.log('====================\n');

// Check environment variables
const requiredEnvVars = [
  'GALILEO_API_KEY',
  'GALILEO_PROJECT_NAME', 
  'GALILEO_LOG_STREAM_NAME'
];

const optionalEnvVars = [
  'GALILEO_BASE_URL',
  'GALILEO_ENABLED'
];

console.log('📋 Environment Variables Check:');
console.log('--------------------------------');

// Check required variables
console.log('\n🔴 Required Variables:');
let missingRequired = false;
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName.includes('KEY') ? '***SET***' : value}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
    missingRequired = true;
  }
});

// Check optional variables
console.log('\n🟡 Optional Variables:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️  ${varName}: NOT SET (using default)`);
  }
});

if (missingRequired) {
  console.log('\n❌ SETUP ISSUE: Missing required environment variables!');
  console.log('\n📝 To fix this:');
  console.log('1. Copy .env.example to .env:');
  console.log('   cp .env.example .env');
  console.log('2. Edit .env and add your actual API keys:');
  console.log('   - GALILEO_API_KEY=your_actual_galileo_api_key');
  console.log('   - OPENAI_API_KEY=your_actual_openai_api_key');
  console.log('3. Restart your application');
  process.exit(1);
}

console.log('\n✅ All required environment variables are set!');
console.log('\n🚀 You can now run your application with Galileo logging enabled.');

// Test Galileo import
try {
  console.log('\n🧪 Testing Galileo import...');
  const galileo = await import('galileo');
  console.log('✅ Galileo package imported successfully');
  console.log('Available functions:', Object.keys(galileo).join(', '));
} catch (error) {
  console.log('❌ Failed to import Galileo package:', error.message);
  process.exit(1);
}

console.log('\n🎉 Galileo setup test completed successfully!');
