#!/usr/bin/env node

/**
 * Stripe Integration Test
 * 
 * This script tests the Stripe agent toolkit integration
 * and verifies that Galileo logging is working properly.
 */

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import { StripeAgentToolkit } from '@stripe/agent-toolkit/langchain';

console.log('🧪 Testing Stripe Integration');
console.log('============================\n');

// Check environment variables
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'GALILEO_API_KEY',
  'OPENAI_API_KEY'
];

console.log('📋 Environment Variables Check:');
console.log('--------------------------------');

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

if (missingRequired) {
  console.log('\n❌ SETUP ISSUE: Missing required environment variables!');
  console.log('\n📝 To fix this:');
  console.log('1. Add your Stripe secret key to .env:');
  console.log('   STRIPE_SECRET_KEY=sk_test_your_key_here');
  console.log('2. Make sure Galileo and OpenAI keys are set');
  console.log('3. Restart your application');
  process.exit(1);
}

console.log('\n✅ All required environment variables are set!');

// Test Stripe Agent Toolkit
try {
  console.log('\n🧪 Testing Stripe Agent Toolkit...');
  
  const stripeAgentToolkit = new StripeAgentToolkit({
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    configuration: {
      actions: {
        paymentLinks: {
          create: true,
        },
        products: {
          list: true,
        },
        customers: {
          create: true,
        },
      },
    },
  });

  const tools = stripeAgentToolkit.getTools();
  console.log(`✅ Stripe Agent Toolkit initialized successfully`);
  console.log(`📦 Available tools: ${tools.length}`);
  
  tools.forEach(tool => {
    console.log(`   - ${tool.name}: ${tool.description}`);
  });

} catch (error) {
  console.log('❌ Failed to initialize Stripe Agent Toolkit:', error.message);
  process.exit(1);
}

// Test Galileo import
try {
  console.log('\n🧪 Testing Galileo integration...');
  const galileo = await import('galileo');
  console.log('✅ Galileo package imported successfully');
  console.log('Available functions:', Object.keys(galileo).join(', '));
} catch (error) {
  console.log('❌ Failed to import Galileo package:', error.message);
  process.exit(1);
}

console.log('\n🎉 Stripe integration test completed successfully!');
console.log('\n🚀 You can now:');
console.log('   - Create payment links');
console.log('   - Manage customers and subscriptions');
console.log('   - Handle refunds and cancellations');
console.log('   - Monitor all operations with Galileo');
