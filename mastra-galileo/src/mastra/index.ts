
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { initializeGalileo } from '../logger/galileo-logger';

/**
 * Mastra Application Configuration
 * 
 * This creates the main Mastra application instance with all workflows,
 * agents, storage, and logging configured. Galileo observability can be
 * initialized separately using the exported functions.
 */
export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent },
  storage: new LibSQLStore({
    // Stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

// Auto-initialize Galileo when this module is imported
initializeGalileo().catch(console.error);

// Export Galileo functions for manual use
export { initializeGalileo, log, init, flush } from '../logger/galileo-logger';

// Export simple tracing context utilities for backward compatibility
export { getTracingContext, setTracingContext, createChildTracingContext } from '../context/tracing-context';
