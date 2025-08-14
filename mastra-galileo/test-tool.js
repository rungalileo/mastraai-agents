#!/usr/bin/env node

/**
 * Simple test to understand Mastra tool structure
 */

import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Create a simple test tool
const testTool = createTool({
  id: 'test-tool',
  description: 'Test tool to understand input structure',
  inputSchema: z.object({
    location: z.string().describe('Test location'),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async (input) => {
    console.log('=== TEST TOOL EXECUTION ===');
    console.log('Input type:', typeof input);
    console.log('Input:', JSON.stringify(input, null, 2));
    console.log('Input keys:', Object.keys(input || {}));
    console.log('Location value:', input?.location);
    console.log('==========================');
    
    return {
      result: `Processed: ${input?.location || 'no location'}`
    };
  },
});

console.log('Test tool created successfully');
console.log('Tool execute function:', testTool.execute.toString().substring(0, 200));
