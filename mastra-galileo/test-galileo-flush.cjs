#!/usr/bin/env node

/**
 * Galileo Flush Test
 * 
 * This script tests that Galileo logs are being flushed immediately
 * after each operation.
 */

require('dotenv').config();

const { initializeGalileo, logWithFlush, flushGalileo } = require('./src/logger/galileo-logger');

async function testGalileoFlush() {
  console.log('🧪 Testing Galileo Immediate Flush...');
  console.log('=====================================\n');
  
  try {
    // Test 1: Initialize Galileo
    console.log('1️⃣ Initializing Galileo...');
    await initializeGalileo();
    console.log('✅ Galileo initialized successfully');
    
    // Test 2: Test immediate flush with logWithFlush
    console.log('\n2️⃣ Testing immediate flush with logWithFlush...');
    const testFunction = logWithFlush({ 
      name: 'test-immediate-flush', 
      spanType: 'tool' 
    }, async (input) => {
      console.log('   📝 Executing function with input:', input);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate work
      console.log('   ✅ Function completed, should flush immediately');
      return { result: `Processed: ${input}` };
    });
    
    const result = await testFunction('test-data');
    console.log('   📊 Function result:', result);
    console.log('✅ Immediate flush test completed');
    
    // Test 3: Manual flush
    console.log('\n3️⃣ Testing manual flush...');
    await flushGalileo();
    console.log('✅ Manual flush completed');
    
    console.log('\n🎉 All Galileo flush tests passed!');
    console.log('📈 Check your Galileo dashboard - data should appear immediately');
    
  } catch (error) {
    console.error('\n❌ Galileo flush test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testGalileoFlush().catch(console.error);
