import { createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { createTracingStep, getTracingInfo } from '../context';

// Example of using the new tracing context system
// This demonstrates automatic span creation and nesting

const dataProcessingStep = createTracingStep({
  id: 'data-processing',
  description: 'Process incoming data',
  inputSchema: z.object({
    data: z.string().describe('Raw data to process'),
  }),
  outputSchema: z.object({
    processedData: z.string(),
    metadata: z.object({
      processedAt: z.string(),
      traceId: z.string().optional(),
    }),
  }),
  spanMetadata: {
    category: 'data-processing',
    tags: ['transformation', 'validation'],
  },
  execute: async ({ inputData, runtimeContext }) => {
    // Get tracing information - this will be automatically available
    const { traceId, currentSpan } = getTracingInfo(runtimeContext);
    
    console.log(`Processing data in trace: ${traceId}`);
    console.log(`Current span exists: ${!!currentSpan}`);
    
    // Simulate some processing work
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Your business logic here
    const processedData = inputData.data.toUpperCase();
    
    return {
      processedData,
      metadata: {
        processedAt: new Date().toISOString(),
        traceId,
      },
    };
  },
});

const validationStep = createTracingStep({
  id: 'validation',
  description: 'Validate processed data',
  inputSchema: z.object({
    processedData: z.string(),
    metadata: z.object({
      processedAt: z.string(),
      traceId: z.string().optional(),
    }),
  }),
  outputSchema: z.object({
    isValid: z.boolean(),
    validatedData: z.string(),
    trace: z.object({
      traceId: z.string().optional(),
      stepCount: z.number(),
    }),
  }),
  spanMetadata: {
    category: 'validation',
    tags: ['quality-check', 'business-rules'],
  },
  execute: async ({ inputData, runtimeContext }) => {
    const { traceId, currentSpan, parentSpan } = getTracingInfo(runtimeContext);
    
    console.log(`Validating data in trace: ${traceId}`);
    console.log(`Has parent span: ${!!parentSpan}`);
    
    // Simulate validation logic
    const isValid = inputData.processedData.length > 0;
    
    await new Promise(resolve => setTimeout(resolve, 50));
    
    return {
      isValid,
      validatedData: inputData.processedData,
      trace: {
        traceId,
        stepCount: 2, // This is the second step
      },
    };
  },
});

// Create the workflow with automatic tracing
export const tracingExampleWorkflow = createWorkflow({
  id: 'tracing-example-workflow',
  description: 'Example workflow demonstrating automatic tracing',
  inputSchema: z.object({
    data: z.string().describe('Raw data to process'),
  }),
  outputSchema: z.object({
    isValid: z.boolean(),
    validatedData: z.string(),
    trace: z.object({
      traceId: z.string().optional(),
      stepCount: z.number(),
    }),
  }),
})
  .then(dataProcessingStep)
  .then(validationStep);

tracingExampleWorkflow.commit();

// Example usage:
// 
// const result = await tracingExampleWorkflow.run({
//   data: "hello world"
// });
// 
// This will:
// 1. Automatically create a trace for the workflow run
// 2. Create a span for the data-processing step (nested under the workflow trace)
// 3. Create a span for the validation step (nested under the workflow trace)
// 4. Properly handle span lifecycle (creation, closing, error handling)
// 5. Propagate trace ID and span context through all steps
