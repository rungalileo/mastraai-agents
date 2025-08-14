import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { log } from '../../logger/galileo-logger';
import { StripeAgentToolkit } from '@stripe/agent-toolkit/langchain';

/**
 * Stripe Tools with Galileo Logging
 * 
 * This module provides Stripe API integration tools with automatic
 * Galileo logging and immediate flushing for real-time observability.
 */

// Initialize Stripe Agent Toolkit with minimal configuration
const stripeAgentToolkit = new StripeAgentToolkit({
  secretKey: process.env.STRIPE_SECRET_KEY 
    actions: {
      paymentLinks: {
        create: true,
      },
    },
  },
});

/**
 * Create Payment Link Tool
 * 
 * Creates a Stripe payment link with immediate Galileo flushing
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
 * Creates a Stripe customer with immediate Galileo flushing
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
 * List Products Tool
 * 
 * Lists Stripe products with immediate Galileo flushing
 */
export const listProductsTool = createTool({
  id: 'list-products',
  description: 'List all Stripe products',
  inputSchema: z.object({
    limit: z.number().optional().describe('Number of products to return (default: 10)'),
    active: z.boolean().optional().describe('Filter by active status'),
  }),
  outputSchema: z.object({
    products: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      active: z.boolean(),
    })),
    success: z.boolean(),
  }),
  execute: async ({ context }: any) => {
    const { limit = 10, active } = context;
    
    return await listProducts(limit, active);
  },
});

/**
 * Create Subscription Tool
 * 
 * Creates a Stripe subscription with immediate Galileo flushing
 */
export const createSubscriptionTool = createTool({
  id: 'create-subscription',
  description: 'Create a new Stripe subscription for a customer',
  inputSchema: z.object({
    customerId: z.string().describe('Stripe customer ID'),
    priceId: z.string().describe('Stripe price ID for the subscription'),
    paymentBehavior: z.string().optional().describe('Payment behavior (default_incomplete, allow_incomplete, error_if_incomplete)'),
  }),
  outputSchema: z.object({
    subscriptionId: z.string(),
    status: z.string(),
    customerId: z.string(),
    success: z.boolean(),
  }),
  execute: async ({ context }: any) => {
    const { customerId, priceId, paymentBehavior } = context;
    
    if (!customerId || !priceId) {
      throw new Error('Customer ID and price ID are required');
    }
    
    return await createSubscription(customerId, priceId, paymentBehavior);
  },
});

/**
 * Cancel Subscription Tool
 * 
 * Cancels a Stripe subscription with immediate Galileo flushing
 */
export const cancelSubscriptionTool = createTool({
  id: 'cancel-subscription',
  description: 'Cancel a Stripe subscription',
  inputSchema: z.object({
    subscriptionId: z.string().describe('Stripe subscription ID to cancel'),
    prorate: z.boolean().optional().describe('Whether to prorate the cancellation'),
  }),
  outputSchema: z.object({
    subscriptionId: z.string(),
    status: z.string(),
    canceledAt: z.string().optional(),
    success: z.boolean(),
  }),
  execute: async ({ context }: any) => {
    const { subscriptionId, prorate = true } = context;
    
    if (!subscriptionId) {
      throw new Error('Subscription ID is required');
    }
    
    return await cancelSubscription(subscriptionId, prorate);
  },
});

/**
 * Create Refund Tool
 * 
 * Creates a Stripe refund with immediate Galileo flushing
 */
export const createRefundTool = createTool({
  id: 'create-refund',
  description: 'Create a refund for a payment',
  inputSchema: z.object({
    paymentIntentId: z.string().describe('Payment intent ID to refund'),
    amount: z.number().optional().describe('Amount to refund in cents (if not specified, refunds full amount)'),
    reason: z.enum(['duplicate', 'fraudulent', 'requested_by_customer']).optional().describe('Reason for the refund'),
  }),
  outputSchema: z.object({
    refundId: z.string(),
    amount: z.number(),
    status: z.string(),
    success: z.boolean(),
  }),
  execute: async ({ context }: any) => {
    const { paymentIntentId, amount, reason } = context;
    
    if (!paymentIntentId) {
      throw new Error('Payment intent ID is required');
    }
    
    return await createRefund(paymentIntentId, amount, reason);
  },
});

/**
 * Create Payment Link
 * 
 * This function creates a Stripe payment link using the Stripe Agent Toolkit.
 * It's wrapped with Galileo logging and immediate flushing for real-time observability.
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
 * It's wrapped with Galileo logging and immediate flushing for real-time observability.
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

/**
 * List Products
 * 
 * This function lists Stripe products using the Stripe Agent Toolkit.
 * It's wrapped with Galileo logging and immediate flushing for real-time observability.
 * 
 * @param limit - Number of products to return
 * @param active - Filter by active status
 * @returns List of products with their details
 */
const listProducts = log({ 
  name: 'list-products-api-call', 
  spanType: 'tool' 
}, async (limit: number = 10, active?: boolean) => {
  try {
    const tools = stripeAgentToolkit.getTools();
    const productsTool = tools.find(tool => tool.name === 'list_products');
    
    if (!productsTool) {
      throw new Error('Products listing tool not available');
    }

    const result = await productsTool.invoke({
      limit,
      active,
    });

    return {
      products: result.data.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        active: product.active,
      })),
      success: true,
    };
  } catch (error) {
    console.error('Error listing products:', error);
    throw new Error(`Failed to list products: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

/**
 * Create Subscription
 * 
 * This function creates a Stripe subscription using the Stripe Agent Toolkit.
 * It's wrapped with Galileo logging and immediate flushing for real-time observability.
 * 
 * @param customerId - Stripe customer ID
 * @param priceId - Stripe price ID for the subscription
 * @param paymentBehavior - Payment behavior setting
 * @returns Subscription data including ID and status
 */
const createSubscription = log({ 
  name: 'create-subscription-api-call', 
  spanType: 'tool' 
}, async (customerId: string, priceId: string, paymentBehavior?: string) => {
  try {
    const tools = stripeAgentToolkit.getTools();
    const subscriptionTool = tools.find(tool => tool.name === 'create_subscription');
    
    if (!subscriptionTool) {
      throw new Error('Subscription creation tool not available');
    }

    const result = await subscriptionTool.invoke({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: paymentBehavior || 'default_incomplete',
    });

    return {
      subscriptionId: result.id,
      status: result.status,
      customerId: result.customer,
      success: true,
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

/**
 * Cancel Subscription
 * 
 * This function cancels a Stripe subscription using the Stripe Agent Toolkit.
 * It's wrapped with Galileo logging and immediate flushing for real-time observability.
 * 
 * @param subscriptionId - Stripe subscription ID to cancel
 * @param prorate - Whether to prorate the cancellation
 * @returns Cancellation data including status and timestamp
 */
const cancelSubscription = log({ 
  name: 'cancel-subscription-api-call', 
  spanType: 'tool' 
}, async (subscriptionId: string, prorate: boolean = true) => {
  try {
    const tools = stripeAgentToolkit.getTools();
    const cancelTool = tools.find(tool => tool.name === 'cancel_subscription');
    
    if (!cancelTool) {
      throw new Error('Subscription cancellation tool not available');
    }

    const result = await cancelTool.invoke({
      subscription: subscriptionId,
      prorate,
    });

    return {
      subscriptionId: result.id,
      status: result.status,
      canceledAt: result.canceled_at ? new Date(result.canceled_at * 1000).toISOString() : undefined,
      success: true,
    };
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error(`Failed to cancel subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

/**
 * Create Refund
 * 
 * This function creates a Stripe refund using the Stripe Agent Toolkit.
 * It's wrapped with Galileo logging and immediate flushing for real-time observability.
 * 
 * @param paymentIntentId - Payment intent ID to refund
 * @param amount - Amount to refund in cents
 * @param reason - Reason for the refund
 * @returns Refund data including ID and status
 */
const createRefund = log({ 
  name: 'create-refund-api-call', 
  spanType: 'tool' 
}, async (paymentIntentId: string, amount?: number, reason?: string) => {
  try {
    const tools = stripeAgentToolkit.getTools();
    const refundTool = tools.find(tool => tool.name === 'create_refund');
    
    if (!refundTool) {
      throw new Error('Refund creation tool not available');
    }

    const result = await refundTool.invoke({
      payment_intent: paymentIntentId,
      amount,
      reason,
    });

    return {
      refundId: result.id,
      amount: result.amount,
      status: result.status,
      success: true,
    };
  } catch (error) {
    console.error('Error creating refund:', error);
    throw new Error(`Failed to create refund: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
});

// Export all Stripe tools
export const stripeTools = {
  createPaymentLinkTool,
  createCustomerTool,
  listProductsTool,
  createSubscriptionTool,
  cancelSubscriptionTool,
  createRefundTool,
};
