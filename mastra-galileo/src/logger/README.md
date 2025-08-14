# Galileo Logger Configuration

This module provides a singleton Galileo logger instance with helper functions and graceful shutdown handling for the Galileo 2.0 API.

## Environment Variables

The logger requires the following environment variables:

- `GALILEO_API_KEY` (required): Your Galileo API key
- `GALILEO_PROJECT_NAME` (optional): Project name (defaults to 'mastra-agents')
- `GALILEO_LOG_STREAM_NAME` (optional): Stream name (defaults to 'default-stream')
- `GALILEO_BASE_URL` (optional): Base URL for Galileo API (defaults to 'https://api.galileo.ai')
- `GALILEO_ENABLED` (optional): Enable/disable logging (defaults to true)

## Modern Galileo 2.0 Usage

The recommended approach is to use the modern Galileo 2.0 API with automatic instrumentation:

```typescript
import { log, init, flush } from './logger/galileo-logger';

// Initialize Galileo context at application startup
await init({
  projectName: 'my-project',
  logStreamName: 'my-stream'
});

// Wrap workflow functions with automatic logging
const myWorkflow = log({ 
  name: 'weather-workflow', 
  spanType: 'workflow' 
}, async (input) => {
  // Your workflow logic here
  return result;
});

// Wrap tool functions with automatic logging
const myTool = log({ 
  name: 'weather-tool', 
  spanType: 'tool' 
}, async (location) => {
  // Your tool logic here
  return weatherData;
});

// Flush data before application shutdown
await flush();
```

## Legacy GalileoLogger Usage

For advanced use cases, you can still use the GalileoLogger instance directly:

```typescript
import { galileoLogger } from './logger/galileo-logger';

// Start a trace
const trace = galileoLogger.startTrace({
  name: 'user-request',
  input: 'Weather request for New York'
});

// Add workflow spans
const workflowSpan = galileoLogger.addWorkflowSpan({
  name: 'fetch-weather',
  input: { city: 'New York' }
});

// Add LLM spans
const llmSpan = galileoLogger.addLlmSpan({
  name: 'weather-analysis',
  model: 'gpt-4o-mini',
  input: 'What is the weather like?',
  output: 'The weather is sunny...'
});

// Add tool spans
const toolSpan = galileoLogger.addToolSpan({
  name: 'weather-api-call',
  input: { location: 'New York' },
  output: { temperature: 72, conditions: 'sunny' }
});

// Conclude spans
galileoLogger.conclude({
  output: 'Weather data retrieved successfully'
});

// Flush data
await galileoLogger.flush();
```

## Features

- **Modern API Support**: Full support for Galileo 2.0 API with automatic instrumentation
- **Singleton Pattern**: One logger instance per application
- **Environment Variable Validation**: Type-safe configuration with fallbacks
- **Error Handling**: Graceful error handling for all operations
- **Graceful Shutdown**: Automatic flushing on process exit/signals
- **Disabled State Support**: No-op operations when logging is disabled
- **TypeScript Support**: Full type definitions for all functions

## Graceful Shutdown

The logger automatically handles graceful shutdown on:
- `SIGINT` (Ctrl+C)
- `SIGTERM` (termination signal)
- `unhandledRejection` events

The logger will attempt to flush all pending data before the process exits.

## Integration with Mastra

The logger is designed to work seamlessly with Mastra workflows and agents:

```typescript
import { log } from './logger/galileo-logger';
import { createStep } from '@mastra/core/steps';

// Create a traced step
const tracedStep = createStep({
  id: 'my-step',
  execute: log({ name: 'my-step', spanType: 'workflow' }, async ({ inputData }) => {
    // Step logic here
    return result;
  })
});
```

## Best Practices

1. **Use Modern API**: Prefer the `log()` function over manual span creation
2. **Initialize Early**: Call `init()` at application startup
3. **Flush on Shutdown**: Always call `flush()` before application exit
4. **Meaningful Names**: Use descriptive names for spans and traces
5. **Error Handling**: Let the logger handle errors automatically
6. **Environment Configuration**: Use environment variables for configuration
