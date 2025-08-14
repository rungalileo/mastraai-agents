/**
 * Simple extension to Mastra context for trace context propagation
 * 
 * This extends Mastra's context to include:
 * - traceId: for connecting related spans
 * - currentSpan: for nesting child spans
 */

// Simple interface for what we need in the context
export interface TracingContext {
  traceId?: string;
  currentSpan?: any; // Whatever type the galileo spans are
}

/**
 * Helper to get tracing context from Mastra context
 */
export function getTracingContext(mastraContext?: any): TracingContext {
  if (!mastraContext) {
    return {};
  }

  return {
    traceId: mastraContext.traceId,
    currentSpan: mastraContext.currentSpan,
  };
}

/**
 * Helper to set tracing context in Mastra context
 */
export function setTracingContext(
  mastraContext: any,
  tracingContext: TracingContext
): void {
  if (!mastraContext) {
    return;
  }

  if (tracingContext.traceId) {
    mastraContext.traceId = tracingContext.traceId;
  }

  if (tracingContext.currentSpan) {
    mastraContext.currentSpan = tracingContext.currentSpan;
  }
}

/**
 * Helper to create a child context that inherits tracing info
 */
export function createChildTracingContext(parentContext?: any): TracingContext {
  const parentTracing = getTracingContext(parentContext);
  
  return {
    traceId: parentTracing.traceId,
    // The current span becomes the parent span for children
    currentSpan: parentTracing.currentSpan,
  };
}
