import { RuntimeContext } from '@mastra/core/runtime-context';
import type { GalileoSpan, MastraTracingContext } from '../types/context';

/**
 * Simple tracing context utilities for backward compatibility
 * 
 * Note: The modern Galileo 2.0 API provides automatic instrumentation
 * through the `log()` function wrapper, making manual tracing less necessary.
 */

/**
 * Get tracing context from runtime context
 */
export function getTracingContext(runtimeContext: RuntimeContext<MastraTracingContext>): MastraTracingContext {
  return {
    traceId: runtimeContext.get('traceId'),
    currentSpan: runtimeContext.get('currentSpan'),
    parentSpan: runtimeContext.get('parentSpan'),
  };
}

/**
 * Set tracing context in runtime context
 */
export function setTracingContext(
  runtimeContext: RuntimeContext<MastraTracingContext>,
  context: Partial<MastraTracingContext>
): void {
  if (context.traceId) {
    runtimeContext.set('traceId', context.traceId);
  }
  if (context.currentSpan) {
    runtimeContext.set('currentSpan', context.currentSpan);
  }
  if (context.parentSpan) {
    runtimeContext.set('parentSpan', context.parentSpan);
  }
}

/**
 * Create a child tracing context
 */
export function createChildTracingContext(
  parentContext: RuntimeContext<MastraTracingContext>
): RuntimeContext<MastraTracingContext> {
  const childContext = new RuntimeContext<MastraTracingContext>();
  
  // Inherit trace ID
  const traceId = parentContext.get('traceId');
  if (traceId) {
    childContext.set('traceId', traceId);
  }
  
  // Set current span as parent for the child context
  const currentSpan = parentContext.get('currentSpan');
  if (currentSpan) {
    childContext.set('parentSpan', currentSpan);
  }
  
  return childContext;
}
