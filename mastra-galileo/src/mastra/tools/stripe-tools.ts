import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { log } from '../../logger/galileo-logger';
import { StripeAgentToolkit } from '@stripe/agent-toolkit/langchain';

/**
 * Stripe Tools with Galileo Logging
 * 
 * This module provides Stripe API integration tools with automatic
 * Galileo logging for observability and monitoring.
 */

// Initialize Stripe Agent Toolkit with minimal configuration
const stripeAgentToolkit = new StripeAgentToolkit({
  secretKey: process.env.STRIPE_SECRET_KEY!,
  configuration: {
    actions: {
      paymentLinks: {
        create: true,
      },
      products: {
        create: true,
      },
      customers: {
        create: true,
      },
      subscriptions: {
        create: true,
      },
      refunds: {
        create: true,
      },
    },
  },
});

/**
 * Create Payment Link Tool
 * 
 * Creates a Stripe payment link with Galileo logging
 */
export const createPaymentLinkTool = createTool({
  id: 'create-payment-link',
  description: 'Create a Stripe payment link for products or services',
  inputSchema: z.object({
    price: z.string().describe('Price ID or amount in cents'),
    productName: z.string().describe('Name of the product or service'),
    successUrl: z.string().optional().describe('URL to redirect after successful payment'),
    cancelUrl: z.string().optional().describe('URL to redirect after cancelled payment'),
  }),
  outputSchema: z.object({
    paymentLink: z.string(),
    paymentLinkId: z.string(),
    success: z.boolean(),
  }),
  execute: async ({ context }: any) => {
    const { price, productName, successUrl, cancelUrl } = context;
    
    if (!price || !productName) {
      throw new Error('Price and product name are required');
    }
    
    return await createPaymentLink(price, productName, successUrl, cancelUrl);
  },
});

/**
 * Create Customer Tool
 * 
 * Creates a Stripe customer with Galileo logging
 */
export const createCustomerTool = createTool({
  id: 'create-customer',
  description: 'Create a new Stripe customer',
  inputSchema: z.object({
    email: z.string().email().describe('Customer email address'),
    name: z.string().optional().describe('Customer full name'),
    phone: z.string().optional().describe('Customer phone number'),
  }),
  outputSchema: z.object({
    customerId: z.string(),
    email: z.string(),
    name: z.string().optional(),
    success: z.boolean(),
  }),
  execute: async ({ context }: any) => {
    const { email, name, phone } = context;
    
    if (!email) {
      throw new Error('Email is required');
    }
    
    return await createCustomer(email, name, phone);
  },
});

/**
 * Create Payment Link
 * 
 * This function creates a Stripe payment link using the Stripe Agent Toolkit.
 * It's wrapped with Galileo logging for observability.
 * 
 * @param price - Price ID or amount in cents
 * @param productName - Name of the product or service
 * @param successUrl - URL to redirect after successful payment
 * @param cancelUrl - URL to redirect after cancelled payment
 * @returns Payment link data including URL and ID
 */
const createPaymentLink = log({ 
  name: 'create-payment-link-api-call', 
  spanType: 'tool' 
}, async (price: string, productName: string, successUrl?: string, cancelUrl?: string) => {
  try {
    // Get the payment link creation tool from Stripe toolkit
    const tools = stripeAgentToolkit.getTools();
    const paymentLinkTool = tools.find(tool => tool.name === 'create_payment_link');
    
    if (!paymentLinkTool) {
      throw new Error('Payment link tool not available');
    }

    // Execute the payment link creation
    const result = await paymentLinkTool.invoke({
      price,
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: productName,
          },
          unit_amount: typeof price === 'string' && !price.startsWith('price_') 
            ? parseInt(price) 
            : undefined,
        },
        quantity: 1,
      }],
      success_url: successUrl || 'https://example.com/success',
      cancel_url: cancelUrl || 'https://example.com/cancel',
    });

    return {
      paymentLink: result.url,
      paymentLinkId: result.id,
      success: true,
    };
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw new Error(`Failed to create payment link: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

/**
 * Create Customer
 * 
 * This function creates a Stripe customer using the Stripe Agent Toolkit.
 * It's wrapped with Galileo logging for observability.
 * 
 * @param email - Customer email address
 * @param name - Customer full name (optional)
 * @param phone - Customer phone number (optional)
 * @returns Customer data including ID and email
 */
const createCustomer = log({ 
  name: 'create-customer-api-call', 
  spanType: 'tool' 
}, async (email: string, name?: string, phone?: string) => {
  try {
    const tools = stripeAgentToolkit.getTools();
    const customerTool = tools.find(tool => tool.name === 'create_customer');
    
    if (!customerTool) {
      throw new Error('Customer creation tool not available');
    }

    const result = await customerTool.invoke({
      email,
      name,
      phone,
    });

    return {
      customerId: result.id,
      email: result.email,
      name: result.name,
      success: true,
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    throw new Error(`Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Export all Stripe tools
export const stripeTools = {
  createPaymentLinkTool,
  createCustomerTool,
};
