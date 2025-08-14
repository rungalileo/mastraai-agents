# Galileo 2.0 Integration Setup Guide

This guide explains how to set up and use the Galileo 2.0 integration with your Mastra agent system for comprehensive observability and telemetry collection.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and configure your Galileo API key:

```bash
cp .env.example .env
```

Edit `.env` and add your Galileo API key:

```env
GALILEO_API_KEY=your_actual_galileo_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Run the Example

```bash
npm run dev
```

## 📋 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GALILEO_API_KEY` | Your Galileo API key for authentication | `gal_abc123...` |
| `OPENAI_API_KEY` | Your OpenAI API key for the weather agent | `sk-abc123...` |

### Optional Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `GALILEO_PROJECT_NAME` | Project name for organizing logs | `mastra-agents` | `my-weather-app` |
| `GALILEO_LOG_STREAM_NAME` | Log stream for categorizing logs | `default-stream` | `production` |
| `GALILEO_BASE_URL` | Galileo API base URL | `https://api.galileo.ai` | `https://custom.galileo.ai` |
| `GALILEO_ENABLED` | Enable/disable Galileo logging | `true` | `false` |

## 🔧 Integration Patterns

### 1. Automatic Workflow Logging

The weather workflow automatically logs all operations using the modern Galileo 2.0 API:

```typescript
import { mastra, initializeMastraWithGalileo } from './src/mastra';

// Initialize Galileo at startup
await initializeMastraWithGalileo();

// Run workflow with automatic logging
const result = await mastra.runWorkflow('weather-workflow', {
  city: 'New York'
});
```

### 2. Manual Function Logging

Wrap any function with automatic Galileo logging:

```typescript
import { log } from './src/logger/galileo-logger';

const myFunction = log({ 
  name: 'my-function', 
  spanType: 'workflow' 
}, async (input) => {
  // Your function logic here
  return result;
});

// Call the function - it's automatically logged
const result = await myFunction(input);
```

### 3. Tool Logging

Tools are automatically logged when wrapped with the `log` function:

```typescript
import { createTool } from '@mastra/core/tools';
import { log } from './src/logger/galileo-logger';

export const myTool = createTool({
  id: 'my-tool',
  execute: log({ 
    name: 'my-tool-execute', 
    spanType: 'tool' 
  }, async ({ context }) => {
    // Tool logic here
    return result;
  }),
});
```

## 📊 Observability Features

### Automatic Logging

- **Workflow Execution**: All workflow steps are automatically logged
- **Tool Calls**: Tool executions are tracked with input/output
- **Agent Interactions**: LLM calls are logged with prompts and responses
- **Error Handling**: Errors are automatically captured and logged
- **Performance Metrics**: Duration and timing information is collected

### Trace Hierarchy

Galileo automatically creates a hierarchical trace structure:

```
Weather Workflow
├── Fetch Weather Step
│   ├── Geocoding API Call
│   └── Weather API Call
└── Plan Activities Step
    └── LLM Call (Weather Agent)
```

### Metrics Collected

- **Execution Time**: Duration of each operation
- **Input/Output**: Data flowing through each step
- **Error Rates**: Failed operations and error details
- **Resource Usage**: API calls and external service usage
- **User Context**: Request metadata and user information

## 🛠️ Development Workflow

### 1. Local Development

For local development, you can disable Galileo logging:

```env
GALILEO_ENABLED=false
```

### 2. Testing

The logger gracefully handles missing configuration:

```typescript
// This will work even without Galileo configured
const result = await mastra.runWorkflow('weather-workflow', {
  city: 'Test City'
});
```

### 3. Production Deployment

For production, ensure all environment variables are set:

```env
GALILEO_API_KEY=your_production_key
GALILEO_PROJECT_NAME=production-weather-app
GALILEO_LOG_STREAM_NAME=production
GALILEO_ENABLED=true
```

## 🔍 Monitoring and Debugging

### Galileo Dashboard

1. Visit [app.galileo.ai](https://app.galileo.ai)
2. Navigate to your project
3. View traces, spans, and metrics in real-time

### Console Logging

The integration provides detailed console output:

```
🌤️  Starting Weather Workflow Example with Galileo Observability
Galileo context initialized for project: mastra-agents, stream: production
Fetching weather for New York
Planning activities for New York, NY
✅ Weather Workflow Completed Successfully!
```

### Error Handling

Errors are automatically captured and logged:

```typescript
try {
  await mastra.runWorkflow('weather-workflow', { city: 'Invalid City' });
} catch (error) {
  // Error is automatically logged to Galileo
  console.error('Workflow failed:', error.message);
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Missing API Key**
   ```
   Error: Required environment variable GALILEO_API_KEY is not set
   ```
   Solution: Add your Galileo API key to `.env`

2. **Network Issues**
   ```
   Error: Failed to initialize Galileo context
   ```
   Solution: Check your internet connection and API key validity

3. **Disabled Logging**
   ```
   Galileo is disabled, skipping initialization
   ```
   Solution: Set `GALILEO_ENABLED=true` in your environment

### Debug Mode

Enable debug logging by setting the log level:

```env
LOG_LEVEL=debug
```

## 📈 Best Practices

### 1. Meaningful Names

Use descriptive names for your spans and traces:

```typescript
// Good
log({ name: 'fetch-weather-data', spanType: 'workflow' }, async () => {})

// Avoid
log({ name: 'func', spanType: 'workflow' }, async () => {})
```

### 2. Proper Error Handling

Let Galileo handle error logging automatically:

```typescript
// Good - let Galileo log the error
try {
  await riskyOperation();
} catch (error) {
  // Galileo automatically logs the error
  throw error;
}

// Avoid - manual error logging
try {
  await riskyOperation();
} catch (error) {
  console.error('Manual error log:', error);
  throw error;
}
```

### 3. Initialization Order

Initialize Galileo before running workflows:

```typescript
// Good
await initializeMastraWithGalileo();
await mastra.runWorkflow('weather-workflow', input);

// Avoid
await mastra.runWorkflow('weather-workflow', input);
await initializeMastraWithGalileo(); // Too late!
```

### 4. Graceful Shutdown

The integration automatically handles graceful shutdown, but you can also manually flush:

```typescript
import { flush } from './src/logger/galileo-logger';

// Before application exit
await flush();
```

## 🔗 Additional Resources

- [Galileo Documentation](https://docs.galileo.ai)
- [Mastra Documentation](https://docs.mastra.ai)
- [OpenAI API Documentation](https://platform.openai.com/docs)

## 🤝 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the console logs for error messages
3. Verify your environment variables are correctly set
4. Check the Galileo dashboard for any failed traces
