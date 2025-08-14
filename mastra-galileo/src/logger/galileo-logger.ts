// Import Galileo functions using require to avoid bundler issues
const galileo = require('galileo');
const { log, init, flush } = galileo;

/**
 * Galileo Logger Configuration Interface
 * 
 * This interface defines the configuration options for the Galileo logger.
 * It maps to the Galileo 2.0 API configuration structure.
 */
interface GalileoConfig {
  projectName: string;
  logStreamName: string;
  apiKey: string;
  baseUrl?: string;
  enabled?: boolean;
}

/**
 * Environment Variable Validation and Parsing
 * 
 * These utility functions provide type-safe environment variable handling
 * with sensible defaults and clear error messages for missing required values.
 */

/**
 * Get a string environment variable with optional default value
 * @param key - The environment variable name
 * @param defaultValue - Optional default value if the environment variable is not set
 * @returns The environment variable value or default
 * @throws Error if the environment variable is required but not set
 */
function getEnvString(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Required environment variable ${key} is not set`);
  }
  return value;
}

/**
 * Get a boolean environment variable with default value
 * @param key - The environment variable name
 * @param defaultValue - Default boolean value if the environment variable is not set
 * @returns The boolean value of the environment variable
 */
function getEnvBoolean(key: string, defaultValue: boolean = true): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

/**
 * Galileo Configuration
 * 
 * This configuration object loads settings from environment variables
 * with sensible defaults for optional values. The configuration follows
 * the Galileo 2.0 API structure.
 */
const config: GalileoConfig = {
  projectName: getEnvString('GALILEO_PROJECT_NAME', 'mastra-agents'),
  logStreamName: getEnvString('GALILEO_LOG_STREAM_NAME', 'default-stream'),
  apiKey: getEnvString('GALILEO_API_KEY'), // Required, no fallback
  baseUrl: getEnvString('GALILEO_BASE_URL', 'https://api.galileo.ai'),
  enabled: getEnvBoolean('GALILEO_ENABLED', true),
};

/**
 * Initialize Galileo Context
 * 
 * This function initializes the Galileo context with the proper
 * configuration. It should be called at application startup.
 */
export async function initializeGalileo(): Promise<void> {
  if (!config.enabled) {
    console.warn('Galileo is disabled, skipping initialization');
    return;
  }

  try {
    await init({
      projectName: config.projectName,
      logStreamName: config.logStreamName,
    });
    
    console.log(`Galileo context initialized for project: ${config.projectName}, stream: ${config.logStreamName}`);
  } catch (error) {
    console.error('Failed to initialize Galileo context:', error);
    throw error;
  }
}

/**
 * Graceful Shutdown Handler
 * 
 * This function ensures that all pending Galileo data is flushed
 * before the application shuts down, preventing data loss.
 */
async function gracefulFlush(): Promise<void> {
  if (config.enabled) {
    try {
      console.log('Flushing Galileo logger...');
      await flush();
      console.log('Galileo logger flushed successfully');
    } catch (error) {
      console.error('Error flushing Galileo logger:', error);
    }
  }
}

/**
 * Process Shutdown Handlers
 * 
 * These event handlers ensure graceful shutdown of the Galileo logger
 * when the application receives termination signals or exits.
 */

// Handle normal process exit (note: 'exit' event doesn't allow async operations)
process.on('exit', () => {
  console.log('Process exiting, attempting to flush Galileo logger...');
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('Received SIGINT, gracefully shutting down...');
  await gracefulFlush();
  process.exit(0);
});

// Handle SIGTERM (termination signal)
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, gracefully shutting down...');
  await gracefulFlush();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await gracefulFlush();
  process.exit(1);
});

/**
 * Galileo Logging Wrapper
 * 
 * This function provides a convenient way to log workflow and tool operations
 * using the modern Galileo 2.0 API.
 * 
 * @param options - Logging options including name and span type
 * @param fn - The function to execute and log
 * @returns A wrapped function that logs the execution
 */
export function logOperation<T>(
  options: { name: string; spanType: 'workflow' | 'tool' },
  fn: (...args: any[]) => Promise<T>
): (...args: any[]) => Promise<T> {
  if (!config.enabled) {
    return fn;
  }

  return log(options, fn);
}

/**
 * Export Configuration for Debugging
 * 
 * This allows other parts of the application to access the Galileo
 * configuration for debugging or validation purposes.
 */
export { config as galileoConfig };

/**
 * Export Modern Galileo Functions
 * 
 * These are the modern Galileo 2.0 API functions that should be used
 * for logging operations instead of the legacy methods.
 */
export { log, init, flush };
