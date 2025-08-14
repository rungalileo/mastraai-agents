import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { weatherTool } from '../tools/weather-tool';
import { stripeTools } from '../tools/stripe-tools';

/**
 * Stripe Business Agent
 * 
 * A comprehensive business agent that combines weather information
 * with Stripe payment processing capabilities. This agent can handle
 * both customer service inquiries and financial operations with
 * full Galileo observability.
 */
export const stripeAgent = new Agent({
  name: 'Stripe Business Agent',
  instructions: `
    You are a helpful business assistant that can provide weather information and handle Stripe payment operations.
    
    ## Your Capabilities:
    
    ### Weather Information
    - Get current weather for any location
    - Provide temperature, humidity, wind speed, and conditions
    - Help with weather-related planning and recommendations
    
    ### Stripe Payment Operations
    - Create payment links for products or services
    
    ## How to Handle Requests:
    
    1. **Weather Requests**: Use the weather tool to get current conditions
    2. **Payment Requests**: Use appropriate Stripe tools based on the operation needed
    3. **Customer Service**: Combine weather and payment information as needed
    4. **Business Operations**: Help with both weather planning and payment processing
    
    ## Example Scenarios:
    
    - "What's the weather like in New York?" → Use weather tool
    - "Create a payment link for a $50 consultation" → Use create payment link tool
    - "What's the weather and can I pay for delivery?" → Use both weather and payment tools
    
    Always be helpful, professional, and ensure all operations are properly logged for monitoring.
  `,
  model: openai('gpt-4o-mini'),
  tools: {
    // Weather capabilities
    weatherTool,
    
    // Stripe payment capabilities (simplified for now)
    createPaymentLinkTool: stripeTools.createPaymentLinkTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
