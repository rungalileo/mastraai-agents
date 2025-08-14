
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { stripeAgent } from './agents/stripe-agent';

/**
 * Mastra Application Configuration
 * 
 * This creates the main Mastra application instance with all workflows,
 * agents, storage, and logging configured. Galileo observability is
 * automatically initialized for all operations.
 */
export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { 
    weatherAgent,
    stripeAgent, // New Stripe-enabled agent
  },
  storage: new LibSQLStore({
    // Stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});

// Export Galileo functions for manual use
export { initializeGalileo, log, init, flush } from '../logger/galileo-logger';

// Export tracing context utilities
export { 
  getTracingContext, 
  setTracingContext, 
  createChildTracingContext 
} from '../context/tracing-context';

// Auto-initialize Galileo when this module is imported
import { initializeGalileo } from '../logger/galileo-logger';
initializeGalileo().catch(console.error);
