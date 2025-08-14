import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import type { ExecuteFunctionParams } from '@mastra/core/dist/workflows/step';
import { tracingContextManager } from '../context/tracing-context';
import type { MastraTracingContext, GalileoSpan } from '../types/context';
import { RuntimeContext } from '@mastra/core/runtime-context';

/**
 * Enhanced execute function params that includes tracing context helpers
 */
interface TracingExecuteFunctionParams<TStepInput, TResumeSchema, TSuspendSchema, EngineType> 
  extends ExecuteFunctionParams<TStepInput, TResumeSchema, TSuspendSchema, EngineType> {
  runtimeContext: RuntimeContext<MastraTracingContext>;
}

/**
 * Enhanced execute function type with tracing support
 */
type TracingExecuteFunction<TStepInput, TStepOutput, TResumeSchema, TSuspendSchema, EngineType> = 
  (params: TracingExecuteFunctionParams<TStepInput, TResumeSchema, TSuspendSchema, EngineType>) => Promise<TStepOutput>;

/**
 * Configuration for creating a tracing-enhanced step
 */
interface TracingStepConfig<
  TStepId extends string,
  TSchemaIn extends z.ZodType<any>,
  TSchemaOut extends z.ZodType<any>,
  TResumeSchema extends z.ZodType<any> = z.ZodType<any>,
  TSuspendSchema extends z.ZodType<any> = z.ZodType<any>
> {
  id: TStepId;
  description?: string;
  inputSchema: TSchemaIn;
  outputSchema: TSchemaOut;
  resumeSchema?: TResumeSchema;
  suspendSchema?: TSuspendSchema;
  execute: TracingExecuteFunction<
    z.infer<TSchemaIn>, 
    z.infer<TSchemaOut>, 
    z.infer<TResumeSchema>, 
    z.infer<TSuspendSchema>, 
    any
  >;
  autoTrace?: boolean; // Whether to automatically create workflow spans
  spanMetadata?: Record<string, any>; // Additional metadata for spans
}

/**
 * Create a step with automatic tracing support
 * This wrapper automatically creates workflow spans and handles context propagation
 */
export function createTracingStep<
  TStepId extends string,
  TSchemaIn extends z.ZodType<any>,
  TSchemaOut extends z.ZodType<any>,
  TResumeSchema extends z.ZodType<any> = z.ZodType<any>,
  TSuspendSchema extends z.ZodType<any> = z.ZodType<any>
>(config: TracingStepConfig<TStepId, TSchemaIn, TSchemaOut, TResumeSchema, TSuspendSchema>) {
  
  return createStep({
    id: config.id,
    description: config.description,
    inputSchema: config.inputSchema,
    outputSchema: config.outputSchema,
    resumeSchema: config.resumeSchema,
    suspendSchema: config.suspendSchema,
    execute: async (params) => {
      const { inputData, runtimeContext } = params;
      const shouldAutoTrace = config.autoTrace !== false; // Default to true
      
      let span: GalileoSpan | null = null;
      
      try {
        // Initialize trace if it doesn't exist
        if (!tracingContextManager.getTraceId(runtimeContext)) {
          tracingContextManager.initializeTrace(
            runtimeContext,
            `workflow-${params.workflowId}`,
            { workflowId: params.workflowId, runId: params.runId }
          );
        }

        // Create workflow span if auto-tracing is enabled
        if (shouldAutoTrace) {
          span = tracingContextManager.createWorkflowSpan(
            runtimeContext,
            config.id,
            inputData,
            {
              ...config.spanMetadata,
              stepId: config.id,
              description: config.description,
              runCount: params.runCount,
            }
          );
        }

        // Execute the original function with enhanced parameters
        const result = await config.execute({
          ...params,
          runtimeContext,
        });

        // Close span with successful result
        if (span) {
          tracingContextManager.closeCurrentSpan(runtimeContext, result);
        }

        return result;

      } catch (error) {
        // Handle error in span
        if (span) {
          tracingContextManager.handleSpanError(runtimeContext, error as Error);
        }
        
        throw error;
      }
    },
  });
}

/**
 * Create an LLM-specific step with automatic LLM span creation
 */
export function createLLMStep<
  TStepId extends string,
  TSchemaIn extends z.ZodType<any>,
  TSchemaOut extends z.ZodType<any>
>(config: TracingStepConfig<TStepId, TSchemaIn, TSchemaOut> & {
  model: string;
  getPrompt: (inputData: z.infer<TSchemaIn>) => string;
}) {
  
  return createStep({
    id: config.id,
    description: config.description,
    inputSchema: config.inputSchema,
    outputSchema: config.outputSchema,
    execute: async (params) => {
      const { inputData, runtimeContext } = params;
      
      let span: GalileoSpan | null = null;
      
      try {
        // Initialize trace if it doesn't exist
        if (!tracingContextManager.getTraceId(runtimeContext)) {
          tracingContextManager.initializeTrace(
            runtimeContext,
            `workflow-${params.workflowId}`,
            { workflowId: params.workflowId, runId: params.runId }
          );
        }

        // Create LLM span
        const prompt = config.getPrompt(inputData);
        span = tracingContextManager.createLLMSpan(
          runtimeContext,
          config.id,
          config.model,
          prompt,
          {
            ...config.spanMetadata,
            stepId: config.id,
            description: config.description,
          }
        );

        // Execute the original function
        const result = await config.execute({
          ...params,
          runtimeContext,
        });

        // Close span with result (should include usage info if available)
        if (span && typeof result === 'object' && result !== null) {
          const usage = (result as any).usage || (result as any).tokenUsage;
          tracingContextManager.closeCurrentSpan(runtimeContext, result, usage);
        } else if (span) {
          tracingContextManager.closeCurrentSpan(runtimeContext, result);
        }

        return result;

      } catch (error) {
        // Handle error in span
        if (span) {
          tracingContextManager.handleSpanError(runtimeContext, error as Error);
        }
        
        throw error;
      }
    },
  });
}

/**
 * Helper to create a child execution context for nested operations
 * This is useful when calling other agents or workflows from within a step
 */
export function createChildTracingContext(
  parentRuntimeContext: RuntimeContext<MastraTracingContext>
): RuntimeContext<MastraTracingContext> {
  return tracingContextManager.createChildContext(parentRuntimeContext);
}

/**
 * Utility to manually create a workflow span within a step
 * Use this when you need more fine-grained control over span creation
 */
export function createManualWorkflowSpan(
  runtimeContext: RuntimeContext<MastraTracingContext>,
  spanName: string,
  input?: any,
  metadata?: Record<string, any>
): GalileoSpan | null {
  return tracingContextManager.createWorkflowSpan(runtimeContext, spanName, input, metadata);
}

/**
 * Utility to manually create an LLM span within a step
 * Use this when you need more fine-grained control over LLM span creation
 */
export function createManualLLMSpan(
  runtimeContext: RuntimeContext<MastraTracingContext>,
  spanName: string,
  model: string,
  prompt: string,
  metadata?: Record<string, any>
): GalileoSpan | null {
  return tracingContextManager.createLLMSpan(runtimeContext, spanName, model, prompt, metadata);
}

/**
 * Helper to get current tracing information from context
 */
export function getTracingInfo(runtimeContext: RuntimeContext<MastraTracingContext>) {
  return {
    traceId: tracingContextManager.getTraceId(runtimeContext),
    currentSpan: tracingContextManager.getCurrentSpan(runtimeContext),
    parentSpan: tracingContextManager.getParentSpan(runtimeContext),
  };
}
