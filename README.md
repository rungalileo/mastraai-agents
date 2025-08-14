# Mastra AI Agent Tutorial Series

A comprehensive step-by-step tutorial for building AI agents with Mastra framework, from basic setup to production-ready observability with Stripe payment integration.

## 🎯 What You'll Build

By the end of this tutorial series, you'll have:

- ✅ **A fully functional AI agent** with tools and workflows
- ✅ **Professional observability** with Galileo integration
- ✅ **Stripe payment integration** with full API capabilities
- ✅ **Production-ready monitoring** and error tracking
- ✅ **Real-world API integration** (weather data + payments)
- ✅ **Best practices** for AI agent development

## 📋 Prerequisites

- **Node.js 18+** installed
- **Git** for version control
- **OpenAI API key** ([get one here](https://platform.openai.com/api-keys))
- **Galileo API key** ([get one here](https://app.galileo.ai)) - for Step 2
- **Stripe API key** ([get one here](https://dashboard.stripe.com/apikeys)) - for Step 3
- Basic familiarity with TypeScript and command line

## 🚀 Tutorial Overview

This tutorial is split into three focused branches, each building upon the previous:

### **Step 1: Create Your First Mastra Agent** 
**Branch**: `step1-create-mastra-agent`

**What you'll accomplish:**
- Set up a new Mastra project from scratch
- Create your first AI agent with OpenAI integration
- Build a weather tool that fetches real data
- Create a workflow that orchestrates agent and tool interactions
- Test your agent through a web playground
- Understand Mastra's core concepts: agents, tools, and workflows

**Key learning outcomes:**
- How to structure a Mastra project
- Agent configuration and tool integration
- Workflow design and execution
- Real API integration patterns
- Testing and debugging your agent

**Time to complete:** ~30 minutes

---

## 🔄 **Step 2: Add Galileo Observability** ⭐ **CURRENT BRANCH**
**Branch**: `step2-add-galileo-agent-reliability`

**What you'll accomplish:**
- Add professional observability to your existing agent
- Integrate Galileo for automatic logging and tracing
- Monitor tool execution performance and errors
- Set up real-time dashboards for agent behavior
- Implement graceful error handling and debugging
- Deploy with production-ready monitoring

**Key learning outcomes:**
- Professional observability patterns
- Performance monitoring and alerting
- Error tracking and debugging workflows
- Production deployment considerations
- Best practices for AI agent reliability

**Time to complete:** ~20 minutes

### **🔄 What Changed from Step 1 to Step 2**

#### **📁 New Files Added**
```
mastra-galileo/
├── src/
│   ├── logger/
│   │   └── galileo-logger.ts          # 🆕 Galileo integration
│   ├── context/
│   │   ├── tracing-context.ts         # 🆕 Context management
│   │   └── index.ts                   # 🆕 Context exports
│   ├── types/
│   │   └── context.ts                 # 🆕 Type definitions
│   └── examples/
│       └── galileo-integration-example.ts  # 🆕 Usage examples
├── .env.example                       # 🆕 Environment template
├── test-galileo.cjs                   # 🆕 Galileo test script
├── test-galileo-setup.js              # 🆕 Setup verification
└── SETUP.md                           # 🆕 Detailed setup guide
```

#### **🔧 Enhanced Files**
```
mastra-galileo/
├── src/
│   ├── mastra/
│   │   ├── index.ts                   # 🔄 Added Galileo auto-initialization
│   │   ├── tools/
│   │   │   └── weather-tool.ts        # 🔄 Added Galileo logging
│   │   └── workflows/
│   │       └── weather-workflow.ts    # 🔄 Added Galileo tracing
│   └── agents/
│       └── weather-agent.ts           # 🔄 Enhanced with observability
├── package.json                       # 🔄 Added Galileo dependencies
└── README.md                          # 🔄 Updated with observability docs
```

#### **📦 New Dependencies Added**
```json
{
  "dependencies": {
    "galileo": "^2.0.0",           // 🆕 Galileo observability platform
    "dotenv": "^16.0.0"            // 🆕 Environment variable management
  }
}
```

#### **🔑 New Environment Variables**
```bash
# Galileo Configuration
GALILEO_API_KEY=your_galileo_api_key_here
GALILEO_PROJECT=mastra-galileo
GALILEO_LOG_STREAM=development
GALILEO_ENABLED=true
```

### **🎯 Key Improvements in Step 2**

#### **✅ Professional Observability**
- **Real-time logging** to Galileo dashboard
- **Automatic tracing** of all agent and tool operations
- **Performance metrics** and response time tracking
- **Error monitoring** with detailed stack traces

#### **✅ Enhanced Weather Tool**
**Before (Step 1):**
```typescript
export const weatherTool = createTool({
  // ... basic tool configuration
  execute: async ({ context }: any) => {
    const location = context.location;
    return await getWeather(location);
  },
});
```

**After (Step 2):**
```typescript
export const weatherTool = createTool({
  // ... enhanced tool configuration
  execute: async ({ context }: any) => {
    const location = context.location;
    return await getWeather(location); // Now logged to Galileo
  },
});

const getWeather = logWithFlush({ 
  name: 'get-weather-api-call', 
  spanType: 'tool' 
}, async (location: string) => {
  // API call with automatic Galileo logging and immediate flush
});
```

#### **✅ Enhanced Workflow**
**Before (Step 1):**
```typescript
const fetchWeather = createStep({
  // ... basic step configuration
  execute: async (params) => {
    // Basic weather fetching logic
  },
});
```

**After (Step 2):**
```typescript
const fetchWeather = createStep({
  // ... enhanced step configuration
  execute: async (params) => {
    // Weather fetching with Galileo tracing and performance monitoring
  },
});
```

#### **✅ Auto-Initialization**
**Before (Step 1):**
```typescript
export const mastra = new Mastra({
  // Basic Mastra configuration
});
```

**After (Step 2):**
```typescript
import { initializeGalileo } from '../logger/galileo-logger';

export const mastra = new Mastra({
  // Enhanced Mastra configuration
});

// Auto-initialize Galileo when this module is imported
initializeGalileo().catch(console.error);
```

### **🚀 New Features in Step 2**

#### **✅ Immediate Flushing**
- **Real-time data** - logs appear in Galileo immediately
- **No buffering delays** - instant observability
- **Error resilience** - flushes even on failures

#### **✅ Graceful Shutdown**
- **Automatic cleanup** - flushes data on process termination
- **Signal handling** - responds to SIGINT, SIGTERM
- **Error recovery** - handles unhandled promise rejections

#### **✅ Manual Control**
```typescript
import { flushGalileo } from '../logger/galileo-logger';

// Flush data manually when needed
await flushGalileo();
```

#### **✅ Testing & Verification**
```bash
# Test Galileo setup
npm run test:setup

# Test Galileo integration
npm run test:galileo

# Test immediate flushing
npm run test:galileo-flush
```

### **📊 What You'll See in Galileo Dashboard**

#### **✅ Real-Time Traces**
- **Request flow visualization** - see how data moves through your agent
- **Performance breakdown** - identify bottlenecks
- **Error tracking** - debug issues instantly

#### **✅ Metrics & Analytics**
- **Response times** - monitor tool and workflow performance
- **Success rates** - track reliability metrics
- **Usage patterns** - understand agent behavior

#### **✅ Debugging Tools**
- **Live logs** - see operations as they happen
- **Error details** - full stack traces and context
- **Performance insights** - optimize your agent

---

### **Step 3: Add Stripe Payment Integration**
**Branch**: `step3-add-stripe-tools`

**What you'll accomplish:**
- Integrate Stripe Agent Toolkit for payment operations
- Create payment links, manage customers and subscriptions
- Handle refunds and cancellations
- Maintain Galileo observability for all Stripe operations
- Build a comprehensive business agent
- Implement secure payment workflows

**Key learning outcomes:**
- Stripe API integration patterns
- Payment processing workflows
- Customer and subscription management
- Security best practices for financial operations
- Combining multiple API integrations

**Time to complete:** ~25 minutes

## 📁 Project Structure (Final Result)

```
mastra-agent-tutorial/
├── src/
│   ├── agents/
│   │   ├── weather-agent.ts       # Weather-focused agent
│   │   └── stripe-agent.ts        # Business agent with Stripe + weather
│   ├── tools/
│   │   ├── weather-tool.ts        # Weather data fetching tool
│   │   └── stripe-tools.ts        # Stripe payment operations
│   ├── workflows/
│   │   └── weather-workflow.ts    # Orchestration workflow
│   ├── logger/
│   │   └── galileo-logger.ts      # Observability integration
│   └── index.ts                   # Main application entry
├── .env                           # Environment configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This guide
```

## 🛠️ Technologies You'll Learn

### **Core Framework**
- **Mastra**: Modern AI agent framework
- **TypeScript**: Type-safe development
- **Zod**: Schema validation and type safety

### **AI & APIs**
- **OpenAI GPT-4**: Large language model integration
- **Open-Meteo**: Real weather data API
- **Stripe API**: Payment processing and business operations
- **AI SDK**: Modern AI development patterns

### **Observability & Monitoring**
- **Galileo**: Professional observability platform
- **Tracing**: Request flow visualization
- **Logging**: Structured logging and debugging

### **Development Tools**
- **Mastra CLI**: Development and deployment tools
- **Hot Reloading**: Fast development iteration
- **Web Playground**: Interactive testing interface

## 🎯 Real-World Application

The comprehensive agent you'll build demonstrates:

### **Practical Use Cases**
- **Customer Service**: Weather and payment inquiries
- **E-commerce**: Payment processing and order management
- **Business Operations**: Customer and subscription management
- **Data Integration**: Real-time API consumption
- **Financial Operations**: Secure payment processing

### **Production Patterns**
- **Error Handling**: Graceful failure management
- **Performance Monitoring**: Response time tracking
- **Security**: Secure payment operations
- **Scalability**: Modular tool and workflow design
- **Observability**: Complete operational visibility

## 📚 Learning Path

### **Phase 1: Foundation (Step 1)**
1. **Project Setup**: Initialize Mastra project
2. **Agent Creation**: Configure AI agent with instructions
3. **Tool Development**: Build weather data fetching tool
4. **Workflow Design**: Orchestrate agent and tool interactions
5. **Testing**: Use web playground to test functionality

### **Phase 2: Production Ready (Step 2)** ⭐ **CURRENT**
1. **Observability Setup**: Add Galileo integration
2. **Monitoring Configuration**: Set up logging and tracing
3. **Error Handling**: Implement robust error management
4. **Performance Optimization**: Monitor and improve response times
5. **Deployment Preparation**: Production-ready configuration

### **Phase 3: Business Integration (Step 3)**
1. **Stripe Integration**: Add payment processing capabilities
2. **Security Implementation**: Secure financial operations
3. **Business Workflows**: Customer and subscription management
4. **Multi-API Coordination**: Combine weather and payment operations
5. **Production Deployment**: Full business-ready agent

## 🔧 Development Workflow

### **Local Development**
```bash
# Start development server
npm run dev

# Access web playground
open http://localhost:4111

# Monitor logs and traces
# Check Galileo dashboard for observability
```

### **Testing Your Agent**
1. **Web Playground**: Interactive testing interface
2. **API Endpoints**: Programmatic access
3. **Galileo Dashboard**: Performance and error monitoring
4. **Console Logs**: Real-time debugging information

### **Testing Scripts**
```bash
# Test environment setup
npm run test:setup

# Test Galileo integration
npm run test:galileo

# Test immediate flushing
npm run test:galileo-flush

# Test Stripe integration (Step 3)
npm run test:stripe
```

## 🐛 Common Challenges & Solutions

### **Step 1 Challenges**
- **Tool Integration**: Understanding Mastra's tool system
- **API Integration**: Handling external API calls
- **Workflow Design**: Orchestrating complex interactions
- **Error Handling**: Managing tool execution failures

### **Step 2 Challenges** ⭐ **CURRENT**
- **Observability Setup**: Configuring Galileo integration
- **Environment Variables**: Managing API keys and configuration
- **Performance Monitoring**: Identifying bottlenecks
- **Production Deployment**: Ensuring reliability

### **Step 3 Challenges**
- **Stripe Integration**: Configuring payment operations
- **Security Concerns**: Managing financial data securely
- **Multi-API Coordination**: Combining different services
- **Business Logic**: Implementing complex payment workflows

## 📊 Success Metrics

### **Step 1 Success Indicators**
- ✅ Agent responds to weather queries
- ✅ Tool fetches real weather data
- ✅ Workflow orchestrates interactions
- ✅ Web playground is functional
- ✅ Error handling works properly

### **Step 2 Success Indicators** ⭐ **CURRENT**
- ✅ Galileo integration is active
- ✅ Traces appear in dashboard
- ✅ Performance metrics are tracked
- ✅ Error monitoring is working
- ✅ Graceful shutdown functions
- ✅ Immediate flushing works

### **Step 3 Success Indicators**
- ✅ Stripe tools are functional
- ✅ Payment operations are secure
- ✅ Galileo logs all Stripe operations
- ✅ Business workflows are complete
- ✅ Multi-service coordination works

## 🚀 Beyond the Tutorial

### **Next Steps After Completion**
- **Custom Tools**: Build tools for your specific domain
- **Advanced Workflows**: Create complex multi-step processes
- **Database Integration**: Connect with persistent storage
- **Deployment**: Deploy to production environments
- **Scaling**: Handle multiple concurrent users

### **Advanced Topics**
- **Memory Management**: Persistent conversation context
- **Multi-Agent Systems**: Coordinated agent interactions
- **Custom Models**: Integration with other LLM providers
- **Security**: Advanced API key management and access control
- **Performance**: Optimization and caching strategies
- **Compliance**: Financial and data protection regulations

## 📚 Additional Resources

### **Documentation**
- [Mastra Documentation](https://docs.mastra.ai) - Official framework docs
- [Galileo Documentation](https://docs.galileo.ai) - Observability platform
- [Stripe Documentation](https://stripe.com/docs) - Payment processing
- [OpenAI API Documentation](https://platform.openai.com/docs) - LLM integration

### **Community**
- [Mastra Discord](https://discord.gg/mastra) - Community support
- [GitHub Discussions](https://github.com/mastra-ai/mastra/discussions) - Q&A
- [Examples Repository](https://github.com/mastra-ai/examples) - More examples

## 🤝 Contributing

This tutorial is part of the Mastra ecosystem. To contribute:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your improvements**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This tutorial is licensed under the MIT License. Feel free to use, modify, and distribute.

---

## 🎉 Ready to Start?

**Begin with Step 1** to create your first Mastra agent:

```bash
git checkout step1-create-mastra-agent
```

Follow the README in that branch to get started with your AI agent journey!

**Questions or Issues?** Open a GitHub issue or join our Discord community for support.
