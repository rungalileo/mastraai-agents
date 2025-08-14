# Mastra Tracing Context System

This module extends Mastra's context system to include automatic tracing support with Galileo spans. It provides seamless span creation, nesting, and propagation throughout workflow execution.

## Features

- **Automatic Trace Initialization**: Traces are automatically created when workflows start
- **Span Nesting**: Child spans automatically nest under parent spans
- **Context Propagation**: Trace IDs and span references are automatically passed through the execution context
- **Error Handling**: Automatic error reporting to spans with proper cleanup
- **Type Safety**: Full TypeScript support with enhanced context types

## Core Components

### TracingContextManager

A singleton class that manages all tracing operations:

```typescript
import { tracingContextManager } from './context/tracing-context';

// Initialize a trace
const traceId = tracingContextManager.initializeTrace(
  runtimeContext, 
  'my-workflow', 
  { userId: '123' }
);

// Create workflow spans
const span = tracingContextManager.createWorkflowSpan(
  runtimeContext,
  'my-step',
  inputData,
  { stepType: 'processing' }
);

// Create LLM spans
const llmSpan = tracingContextManager.createLLMSpan(
  runtimeContext,
  'gpt-call',
  'gpt-4o-mini',
  'What is the weather?',
  { temperature: 0.7 }
);
```

### Enhanced Context Types

Extended context interfaces that include tracing information:

```typescript
import type { MastraTracingContext, GalileoSpan } from './types/context';

interface MastraTracingContext {
  traceId?: string;
  currentSpan?: GalileoSpan;
  parentSpan?: GalileoSpan;
}
```

### Tracing-Enhanced Steps

Helper functions to create steps with automatic tracing:

```typescript
import { createTracingStep, createLLMStep } from './utils/tracing-helpers';

// Auto-traced workflow step
const myStep = createTracingStep({
  id: 'my-step',
  description: 'Process data',
  inputSchema: z.object({ data: z.string() }),
  outputSchema: z.object({ result: z.string() }),
  spanMetadata: { 
    category: 'data-processing',
    tags: ['important'] 
  },
  execute: async ({ inputData, runtimeContext }) => {
    // Your logic here - spans are automatically created and managed
    const { traceId } = getTracingInfo(runtimeContext);
    console.log(`Processing in trace: ${traceId}`);
    
    return { result: `Processed: ${inputData.data}` };
  },
});

// Auto-traced LLM step
const llmStep = createLLMStep({
  id: 'llm-step',
  description: 'Generate response',
  inputSchema: z.object({ prompt: z.string() }),
  outputSchema: z.object({ response: z.string() }),
  model: 'gpt-4o-mini',
  getPrompt: (inputData) => inputData.prompt,
  execute: async ({ inputData, runtimeContext }) => {
    // LLM spans are automatically created with proper metadata
    // Your LLM call logic here
    return { response: 'Generated response' };
  },
});
```

## Usage Patterns

### Basic Workflow with Auto-Tracing

```typescript
import { createTracingStep } from './context';

const step1 = createTracingStep({
  id: 'fetch-data',
  inputSchema: z.object({ id: z.string() }),
  outputSchema: z.object({ data: z.any() }),
  execute: async ({ inputData, runtimeContext }) => {
    // Automatic span creation for this step
    // Trace ID automatically propagated
    const data = await fetchFromAPI(inputData.id);
    return { data };
  },
});

const step2 = createTracingStep({
  id: 'process-data',
  inputSchema: z.object({ data: z.any() }),
  outputSchema: z.object({ result: z.string() }),
  execute: async ({ inputData, runtimeContext }) => {
    // This step's span will be nested under the workflow trace
    // Parent-child relationships are automatic
    const result = processData(inputData.data);
    return { result };
  },
});

const workflow = createWorkflow({ id: 'my-workflow' })
  .then(step1)
  .then(step2);
```

### Manual Span Control

When you need fine-grained control over span creation:

```typescript
import { 
  createManualWorkflowSpan, 
  createManualLLMSpan,
  tracingContextManager 
} from './context';

const manualStep = createStep({
  id: 'manual-tracing',
  execute: async ({ inputData, runtimeContext }) => {
    // Manual workflow span
    const processingSpan = createManualWorkflowSpan(
      runtimeContext,
      'data-processing',
      inputData,
      { phase: 'preprocessing' }
    );

    try {
      const preprocessed = await preprocessData(inputData);
      
      // Manual LLM span (nested under processing span)
      const llmSpan = createManualLLMSpan(
        runtimeContext,
        'text-generation',
        'gpt-4o-mini',
        'Generate summary of: ' + preprocessed
      );

      const summary = await generateSummary(preprocessed);
      
      // Close LLM span
      tracingContextManager.closeCurrentSpan(runtimeContext, summary, usageInfo);
      
      // Close processing span
      tracingContextManager.closeCurrentSpan(runtimeContext, { summary });
      
      return { summary };
    } catch (error) {
      tracingContextManager.handleSpanError(runtimeContext, error);
      throw error;
    }
  },
});
```

### Child Context for Nested Operations

When calling other agents or workflows from within a step:

```typescript
import { createChildTracingContext } from './context';

const orchestratorStep = createTracingStep({
  id: 'orchestrate',
  execute: async ({ inputData, runtimeContext, mastra }) => {
    // Create child context for sub-agent call
    const childContext = createChildTracingContext(runtimeContext);
    
    // Sub-agent calls will inherit trace ID and nest spans properly
    const subAgent = mastra.getAgent('sub-agent');
    const result = await subAgent.generate(prompt, { 
      context: childContext 
    });
    
    return result;
  },
});
```

### Getting Tracing Information

```typescript
import { getTracingInfo } from './context';

const step = createTracingStep({
  id: 'info-step',
  execute: async ({ inputData, runtimeContext }) => {
    const { traceId, currentSpan, parentSpan } = getTracingInfo(runtimeContext);
    
    console.log(`Current trace: ${traceId}`);
    console.log(`Current span exists: ${!!currentSpan}`);
    console.log(`Parent span exists: ${!!parentSpan}`);
    
    // Use this information for conditional logic or logging
    return { processed: true };
  },
});
```

## Benefits

1. **Automatic Span Management**: No need to manually create, track, or close spans
2. **Proper Nesting**: Parent-child relationships are automatically maintained
3. **Error Handling**: Spans are properly closed even when errors occur
4. **Context Propagation**: Trace information flows seamlessly through the execution
5. **Type Safety**: Full TypeScript support prevents common tracing errors
6. **Flexibility**: Mix automatic and manual span control as needed

## Migration from Manual Tracing

To migrate from manual span management:

1. Replace `createStep` with `createTracingStep`
2. Remove manual `galileoLogger.addWorkflowSpan()` calls
3. Remove manual span closing and error handling
4. Use `runtimeContext` instead of `mastra.context` for tracing info
5. Add `spanMetadata` for additional span information

The new system handles all the complexity of proper span lifecycle management while providing the same tracing capabilities.
