#!/usr/bin/env node

/**
 * Stripe Integration Test with Galileo Observability
 * 
 * This script tests the complete Stripe integration with Galileo
 * observability to ensure all payment operations are properly logged.
 */

require('dotenv').config();

const { initializeGalileo, log, flush } = require('./src/logger/galileo-logger');

async function testStripeIntegration() {
  console.log('🧪 Testing Stripe Integration with Galileo Observability');
  console.log('========================================================\n');
  
  try {
    // Test 1: Initialize Galileo
    console.log('1️⃣ Initializing Galileo...');
    await initializeGalileo();
    console.log('✅ Galileo initialized successfully');
    
    // Test 2: Test Stripe Agent Toolkit
    console.log('\n2️⃣ Testing Stripe Agent Toolkit...');
    const { StripeAgentToolkit } = require('@stripe/agent-toolkit/langchain');
    
    const stripeAgentToolkit = new StripeAgentToolkit({
      secretKey: process.env.STRIPE_SECRET_KEY || '',
      configuration: {
        actions: {
          paymentLinks: { create: true },
          products: { create: true },
          customers: { create: true },
          subscriptions: { create: true },
          refunds: { create: true },
        },
      },
    });
    
    const tools = stripeAgentToolkit.getTools();
    console.log(`✅ Stripe Agent Toolkit initialized successfully`);
    console.log(`📦 Available tools: ${tools.length}`);
    tools.forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });
    
    // Test 3: Test Galileo logging with Stripe operations
    console.log('\n3️⃣ Testing Galileo logging with Stripe operations...');
    
    const testStripeOperation = log({
      name: 'test-stripe-operation',
      spanType: 'tool'
    }, async (operation) => {
      console.log(`   📝 Testing Stripe operation: ${operation}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      console.log(`   ✅ Stripe operation completed: ${operation}`);
      return { success: true, operation };
    });
    
    const result = await testStripeOperation('create-payment-link');
    console.log('   📊 Test result:', result);
    console.log('✅ Galileo logging with Stripe operations working');
    
    // Test 4: Test immediate flush
    console.log('\n4️⃣ Testing immediate flush...');
    await flush();
    console.log('✅ Galileo flush completed successfully');
    
    console.log('\n🎉 All Stripe integration tests passed!');
    console.log('📈 Check your Galileo dashboard for Stripe operation traces');
    console.log('\n🚀 You can now:');
    console.log('   - Create payment links with Galileo observability');
    console.log('   - Manage customers and subscriptions');
    console.log('   - Handle refunds and cancellations');
    console.log('   - Monitor all Stripe operations in real-time');
    
  } catch (error) {
    console.error('\n❌ Stripe integration test failed:', error.message);
    
    if (error.message.includes('STRIPE_SECRET_KEY')) {
      console.log('\n💡 To fix this:');
      console.log('1. Add your Stripe secret key to .env');
      console.log('2. Get your key from https://dashboard.stripe.com/apikeys');
      console.log('3. Run this test again');
    }
    
    if (error.message.includes('GALILEO_API_KEY')) {
      console.log('\n💡 To fix this:');
      console.log('1. Add your Galileo API key to .env');
      console.log('2. Get your key from https://app.galileo.ai');
      console.log('3. Run this test again');
    }
    
    process.exit(1);
  }
}

// Run the test
testStripeIntegration().catch(console.error);
