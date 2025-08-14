#!/usr/bin/env node

/**
 * Simple test script to verify Galileo integration
 * 
 * This script tests the basic Galileo functionality without requiring
 * the full Mastra application to be running.
 */

// Load environment variables
require('dotenv').config();

// Import Galileo functions
const { initializeGalileo, log, flush } = require('./src/logger/galileo-logger');

async function testGalileoIntegration() {
  console.log('🧪 Testing Galileo Integration...');
  console.log('=====================================');
  
  try {
    // Test 1: Initialize Galileo
    console.log('\n1️⃣ Testing Galileo initialization...');
    await initializeGalileo();
    console.log('✅ Galileo initialized successfully');
    
    // Test 2: Test logging function
    console.log('\n2️⃣ Testing Galileo logging...');
    const testFunction = log({ 
      name: 'test-function', 
      spanType: 'workflow' 
    }, async (input) => {
      console.log('   📝 Executing test function with input:', input);
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate work
      return { result: `Processed: ${input}` };
    });
    
    const result = await testFunction('Hello Galileo!');
    console.log('   📊 Function result:', result);
    console.log('✅ Galileo logging working correctly');
    
    // Test 3: Test flush
    console.log('\n3️⃣ Testing Galileo flush...');
    await flush();
    console.log('✅ Galileo flush completed successfully');
    
    console.log('\n🎉 All Galileo tests passed!');
    console.log('📈 Check your Galileo dashboard for the test traces');
    
  } catch (error) {
    console.error('\n❌ Galileo test failed:', error.message);
    
    if (error.message.includes('GALILEO_API_KEY')) {
      console.log('\n💡 To fix this:');
      console.log('1. Copy .env.example to .env');
      console.log('2. Add your Galileo API key to .env');
      console.log('3. Run this test again');
    }
    
    process.exit(1);
  }
}

// Run the test
testGalileoIntegration().catch(console.error);
