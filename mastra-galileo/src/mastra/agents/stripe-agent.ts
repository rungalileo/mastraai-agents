import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { weatherTool } from '../tools/weather-tool';
import { stripeTools } from '../tools/stripe-tools';

/**
 * Stripe Business Agent
 * 
 * A comprehensive AI agent that can handle both weather information
 * and Stripe payment operations with full Galileo observability.
 */
export const stripeAgent = new Agent({
  name: 'Stripe Business Agent',
  instructions: `
    You are a helpful business assistant that can provide weather information and handle Stripe payment operations.

    Your capabilities include:

    WEATHER OPERATIONS:
    - Get current weather for any location
    - Provide weather-based recommendations for events or travel
    - Help with weather-dependent business decisions

    STRIPE PAYMENT OPERATIONS:
    - Create payment links for products or services
    - Manage customer accounts and subscriptions
    - Handle refunds and cancellations
    - List and manage products

    When responding:
    - Always ask for necessary information if not provided
    - For weather queries: Ask for location if not specified
    - For Stripe operations: Confirm details before proceeding
    - Provide clear, actionable responses
    - Include relevant details and next steps
    - Handle errors gracefully and suggest alternatives

    Use the appropriate tools based on the user's request:
    - Weather-related queries: Use weatherTool
    - Payment operations: Use the appropriate Stripe tool
    - Combined requests: Use multiple tools as needed

    Always prioritize security and accuracy in financial operations.
  `,
  model: openai('gpt-4o-mini'),
  tools: {
    weatherTool,
    createPaymentLinkTool: stripeTools.createPaymentLinkTool,
    createCustomerTool: stripeTools.createCustomerTool,
    listProductsTool: stripeTools.listProductsTool,
    createSubscriptionTool: stripeTools.createSubscriptionTool,
    cancelSubscriptionTool: stripeTools.cancelSubscriptionTool,
    createRefundTool: stripeTools.createRefundTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});
