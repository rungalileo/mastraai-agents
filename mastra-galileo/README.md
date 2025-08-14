# Step 2: Add Galileo Observability to Mastra Agent

This is **Step 2** of the Mastra Agent tutorial. If you haven't completed Step 1, go back to the `step1-create-mastra-agent` branch first.

## 🎯 What We're Adding

- **Galileo Observability**: Automatic logging and tracing for your agent
- **Tool Execution Monitoring**: Track how your tools perform
- **Error Handling**: Better debugging and error tracking
- **Performance Metrics**: Monitor response times and usage

## 📋 Prerequisites

- ✅ Completed Step 1 (Mastra agent working)
- Galileo API key ([get one here](https://app.galileo.ai))
- Your existing Mastra agent project

## 🚀 Step-by-Step: Add Galileo to Your Agent

### Step 1: Install Galileo Dependencies
```bash
# From your existing Mastra agent project
npm install galileo
```

### Step 2: Add Galileo Environment Variables
```bash
# Add these to your existing .env file
echo "GALILEO_API_KEY=your_actual_galileo_api_key_here" >> .env
echo "GALILEO_PROJECT_NAME=your-project-name" >> .env
echo "GALILEO_LOG_STREAM_NAME=production" >> .env
```

**Or manually add to your `.env`:**
```env
# Add these to your existing .env file
GALILEO_API_KEY=your_actual_galileo_api_key_here
GALILEO_PROJECT_NAME=your-project-name
GALILEO_LOG_STREAM_NAME=production
```

### Step 3: Create Galileo Logger
Create `src/logger/galileo-logger.ts`:

```typescript
// Import Galileo functions using require to avoid bundler issues
const galileo = require('galileo');
const { log, init, flush } = galileo;

interface GalileoConfig {
  projectName: string;
  logStreamName: string;
  apiKey: string;
  enabled?: boolean;
}

const config: GalileoConfig = {
  projectName: process.env.GALILEO_PROJECT_NAME || 'mastra-agents',
  logStreamName: process.env.GALILEO_LOG_STREAM_NAME || 'default-stream',
  apiKey: process.env.GALILEO_API_KEY || '',
  enabled: process.env.GALILEO_ENABLED !== 'false',
};

export async function initializeGalileo(): Promise<void> {
  if (!config.enabled || !config.apiKey) {
    console.warn('Galileo is disabled or missing API key');
    return;
  }

  try {
    await init({
      projectName: config.projectName,
      logStreamName: config.logStreamName,
    });
    console.log(`Galileo initialized: ${config.projectName}/${config.logStreamName}`);
  } catch (error) {
    console.error('Failed to initialize Galileo:', error);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  if (config.enabled) {
    await flush();
  }
  process.exit(0);
});

export { log, init, flush };
```

### Step 4: Update Your Main Application
Update your main `src/index.ts` or wherever you initialize your Mastra app:

```typescript
import { initializeGalileo } from './logger/galileo-logger';

// Initialize Galileo before starting your app
await initializeGalileo();

// Your existing Mastra app code...
```

### Step 5: Add Galileo to Your Tools
Update your existing tools to include Galileo logging:

```typescript
import { createTool } from '@mastra/core/tools';
import { log } from '../logger/galileo-logger';

export const yourTool = createTool({
  id: 'your-tool',
  description: 'Your tool description',
  inputSchema: z.object({
    // your schema
  }),
  outputSchema: z.object({
    // your output schema
  }),
  execute: log({ 
    name: 'your-tool-execute', 
    spanType: 'tool' 
  }, async ({ context }) => {
    // Your existing tool logic here
    return result;
  }),
});
```

## 🔧 Key Implementation Details

### Tool Structure (Important!)
```typescript
// ✅ CORRECT: Use destructuring for context
execute: async ({ context }: any) => {
  const input = context.input; // Access your input data
  return result;
},

// ❌ WRONG: Don't use direct parameter
execute: async (input: any) => {
  return result;
},
```

### Galileo Logging Pattern
```typescript
// Wrap your functions with Galileo logging
const yourFunction = log({ 
  name: 'your-function-name', 
  spanType: 'tool' // or 'workflow'
}, async (params) => {
  // Your function logic
  return result;
});
```

### Environment Variables
Make sure your `.env` file includes:
```env
GALILEO_API_KEY=your_actual_key_here
GALILEO_PROJECT_NAME=your-project-name
GALILEO_LOG_STREAM_NAME=production
```

## 🐛 Common Issues & Solutions

### Issue 1: Tool Execution Errors
**Problem**: "Location is required" or similar errors
```typescript
// ❌ Wrong - This causes the error
execute: async (input: any) => {
  const location = input.location;
}

// ✅ Correct - Use destructuring
execute: async ({ context }: any) => {
  const location = context.location;
}
```

### Issue 2: Galileo Not Initializing
**Problem**: No Galileo initialization messages
```typescript
// Make sure you call this before starting your app
await initializeGalileo();
```

### Issue 3: Environment Variables Not Working
**Problem**: Galileo API key not found
```bash
# Check your .env file
cat .env | grep GALILEO

# Make sure you have:
GALILEO_API_KEY=your_actual_key_here
```

### Issue 4: Import Errors
**Problem**: Galileo import failing
```typescript
// Use require for Galileo (avoids bundler issues)
const galileo = require('galileo');
const { log, init, flush } = galileo;
```

## 📊 Testing Your Galileo Integration

### Step 6: Test Your Integration
```bash
# Start your development server
npm run dev
```

### Expected Console Output
```
Galileo initialized: your-project-name/production
INFO [Mastra]: Mastra API running on port http://localhost:4111/api
INFO [Mastra]: 👨‍💻 Playground available at http://localhost:4111
```

### Test Your Tools
1. Go to `http://localhost:4111`
2. Use your agent with tools
3. Check console for Galileo messages
4. Visit [Galileo Dashboard](https://app.galileo.ai) to see traces

### What You Should See
- ✅ Galileo initialization message
- ✅ Tool execution without errors
- ✅ Traces in Galileo dashboard
- ✅ Graceful shutdown with flushing

## 🛠️ Next Steps

### What You've Accomplished
- ✅ Added Galileo observability to your Mastra agent
- ✅ Automatic logging of tool executions
- ✅ Performance monitoring and error tracking
- ✅ Real-time traces in Galileo dashboard

### Continue Building
- Add more tools with Galileo logging
- Create workflows with automatic tracing
- Monitor performance in Galileo dashboard
- Set up alerts for errors and performance issues

## 📁 What You've Added

```
your-project/
├── src/
│   ├── logger/
│   │   └── galileo-logger.ts      # NEW: Galileo integration
│   ├── tools/
│   │   └── your-tool.ts           # UPDATED: Added Galileo logging
│   └── index.ts                   # UPDATED: Galileo initialization
├── .env                           # UPDATED: Added Galileo variables
└── package.json                   # UPDATED: Added galileo dependency
```

## 🎉 Success Indicators

- ✅ Galileo initializes without errors
- ✅ Tools execute without "Location is required" errors
- ✅ Traces appear in your Galileo dashboard
- ✅ Graceful shutdown with trace flushing
- ✅ Better debugging and monitoring capabilities

## 📚 Additional Resources

- **Step 1**: `step1-create-mastra-agent` branch - Basic Mastra agent setup
- **Step 2**: This branch - Adding Galileo observability
- [Galileo Documentation](https://docs.galileo.ai) - Official Galileo docs
- [Mastra Documentation](https://docs.mastra.ai) - Official Mastra docs

---

**🎉 Congratulations!** You've successfully added Galileo observability to your Mastra agent. Your agent now has professional-grade monitoring, logging, and debugging capabilities.
