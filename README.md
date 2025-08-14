# Mastra AI Agent Tutorial Series

A comprehensive step-by-step tutorial for building AI agents with Mastra framework, from basic setup to production-ready observability.

## 🎯 What You'll Build

By the end of this tutorial series, you'll have:

- ✅ **A fully functional AI agent** with tools and workflows
- ✅ **Professional observability** with Galileo integration
- ✅ **Production-ready monitoring** and error tracking
- ✅ **Real-world API integration** (weather data example)
- ✅ **Best practices** for AI agent development

## 📋 Prerequisites

- **Node.js 18+** installed
- **Git** for version control
- **OpenAI API key** ([get one here](https://platform.openai.com/api-keys))
- **Galileo API key** ([get one here](https://app.galileo.ai)) 
- Basic familiarity with TypeScript and command line

## 🚀 Tutorial Overview

This tutorial is split into two focused branches, each building upon the previous:

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

### **Step 2: Add Galileo Observability**
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

## 📁 Project Structure (Final Result)

```
mastra-agent-tutorial/
├── src/
│   ├── agents/
│   │   └── weather-agent.ts       # AI agent with weather expertise
│   ├── tools/
│   │   └── weather-tool.ts        # Weather data fetching tool
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

The weather agent you'll build demonstrates:

### **Practical Use Cases**
- **Customer Service**: Weather-related inquiries
- **Travel Planning**: Weather-based recommendations
- **Event Planning**: Weather-dependent scheduling
- **Data Integration**: Real-time API consumption

### **Production Patterns**
- **Error Handling**: Graceful failure management
- **Performance Monitoring**: Response time tracking
- **User Experience**: Natural language interactions
- **Scalability**: Modular tool and workflow design

## 📚 Learning Path

### **Phase 1: Foundation (Step 1)**
1. **Project Setup**: Initialize Mastra project
2. **Agent Creation**: Configure AI agent with instructions
3. **Tool Development**: Build weather data fetching tool
4. **Workflow Design**: Orchestrate agent and tool interactions
5. **Testing**: Use web playground to test functionality

### **Phase 2: Production Ready (Step 2)**
1. **Observability Setup**: Add Galileo integration
2. **Monitoring Configuration**: Set up logging and tracing
3. **Error Handling**: Implement robust error management
4. **Performance Optimization**: Monitor and improve response times
5. **Deployment Preparation**: Production-ready configuration

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

## 🐛 Common Challenges & Solutions

### **Step 1 Challenges**
- **Tool Integration**: Understanding Mastra's tool system
- **API Integration**: Handling external API calls
- **Workflow Design**: Orchestrating complex interactions
- **Error Handling**: Managing tool execution failures

### **Step 2 Challenges**
- **Observability Setup**: Configuring Galileo integration
- **Environment Variables**: Managing API keys and configuration
- **Performance Monitoring**: Identifying bottlenecks
- **Production Deployment**: Ensuring reliability

## 📊 Success Metrics

### **Step 1 Success Indicators**
- ✅ Agent responds to weather queries
- ✅ Tool fetches real weather data
- ✅ Workflow orchestrates interactions
- ✅ Web playground is functional
- ✅ Error handling works properly

### **Step 2 Success Indicators**
- ✅ Galileo integration is active
- ✅ Traces appear in dashboard
- ✅ Performance metrics are tracked
- ✅ Error monitoring is working
- ✅ Graceful shutdown functions

## 🚀 Beyond the Tutorial

### **Next Steps After Completion**
- **Custom Tools**: Build tools for your specific domain
- **Advanced Workflows**: Create complex multi-step processes
- **Integration**: Connect with databases and external services
- **Deployment**: Deploy to production environments
- **Scaling**: Handle multiple concurrent users

### **Advanced Topics**
- **Memory Management**: Persistent conversation context
- **Multi-Agent Systems**: Coordinated agent interactions
- **Custom Models**: Integration with other LLM providers
- **Security**: API key management and access control
- **Performance**: Optimization and caching strategies

## 📚 Additional Resources

### **Documentation**
- [Mastra Documentation](https://docs.mastra.ai) - Official framework docs
- [Galileo Documentation](https://v2docs.galileo.ai) - Agent Reliability and Evaluation platform
- [OpenAI API Documentation](https://platform.openai.com/docs) - LLM integration

### **Additional Resources**

- [Galileo Examples](https://github.com/rungalileo/sdk-examples) 
- [Mastra Examples Repository](https://github.com/mastra-ai/examples) 

## 🎉 Ready to Start?

**Begin with Step 1** to create your first Mastra agent:

```bash
git checkout step1-create-mastra-agent
```

Follow the README in that branch to get started with your AI agent journey!

**Questions or Issues?** Open a GitHub issue or join our Discord community for support.