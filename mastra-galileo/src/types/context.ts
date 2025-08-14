import { RuntimeContext } from '@mastra/core/runtime-context';

// Define basic types for Galileo spans and traces
export interface GalileoSpan {
  id?: string;
  name?: string;
  close?: (data?: any) => void;
  error?: (error: Error) => void;
}

export interface GalileoTrace {
  id?: string;
  name?: string;
}

// Extended context interface that includes tracing information
export interface MastraTracingContext {
  traceId?: string;
  currentSpan?: GalileoSpan;
  parentSpan?: GalileoSpan;
}

// Type for the enhanced runtime context that supports tracing
export type EnhancedRuntimeContext = RuntimeContext<MastraTracingContext>;

// Helper type for workflow and step execution parameters
export interface TracingExecuteParams {
  traceId?: string;
  parentSpan?: GalileoSpan;
}
