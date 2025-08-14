import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

/**
 * Alternative Weather Tool Implementation
 * 
 * This version handles input validation more explicitly to help debug
 * the tool execution issue.
 */
export const weatherToolFixed = createTool({
  id: 'get-weather-fixed',
  description: 'Get current weather for a location (fixed version)',
  inputSchema: z.object({
    location: z.string().describe('City name'),
  }),
  outputSchema: z.object({
    temperature: z.number(),
    feelsLike: z.number(),
    humidity: z.number(),
    windSpeed: z.number(),
    windGust: z.number(),
    conditions: z.string(),
    location: z.string(),
  }),
  execute: async (input: any) => {
    console.log('=== WEATHER TOOL FIXED DEBUG ===');
    console.log('Input received:', JSON.stringify(input, null, 2));
    
    // Validate input manually
    if (!input || typeof input !== 'object') {
      throw new Error(`Invalid input: expected object, got ${typeof input}`);
    }
    
    if (!input.location || typeof input.location !== 'string') {
      throw new Error(`Invalid location: expected string, got ${typeof input.location}`);
    }
    
    const location = input.location;
    console.log('Processing location:', location);
    
    // Simulate weather data for testing
    return {
      temperature: 72,
      feelsLike: 75,
      humidity: 60,
      windSpeed: 10,
      windGust: 15,
      conditions: 'Partly cloudy',
      location: location,
    };
  },
});
