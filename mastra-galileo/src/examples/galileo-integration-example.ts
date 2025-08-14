import { mastra, initializeMastraWithGalileo } from '../mastra';
import { log } from '../logger/galileo-logger';

/**
 * Galileo Integration Example
 * 
 * This example demonstrates how to use the updated Galileo 2.0 integration
 * with the Mastra agent system. It shows proper initialization, workflow
 * execution, and graceful shutdown.
 */

/**
 * Example: Weather Workflow with Galileo Observability
 * 
 * This function demonstrates how to run the weather workflow with
 * automatic Galileo logging and observability.
 */
async function runWeatherWorkflowExample(): Promise<void> {
  console.log('🌤️  Starting Weather Workflow Example with Galileo Observability');
  
  try {
    // Initialize Galileo context
    await initializeMastraWithGalileo();
    
    // Note: Workflow execution would be done through the Mastra CLI or server
    // This is just an example of how to initialize Galileo
    console.log('\n✅ Galileo initialized successfully!');
    console.log('📊 Weather workflow is ready to run with Galileo observability');
    
  } catch (error) {
    console.error('❌ Error running weather workflow:', error);
  }
}

/**
 * Example: Custom Workflow with Manual Galileo Logging
 * 
 * This function demonstrates how to create a custom workflow with
 * manual Galileo logging using the log wrapper.
 */
async function runCustomWorkflowExample(): Promise<void> {
  console.log('\n🔧 Starting Custom Workflow Example');
  
  // Create a custom workflow function with Galileo logging
  const customWorkflow = log({ 
    name: 'custom-data-processing', 
    spanType: 'workflow' 
  }, async (input: { data: string }) => {
    console.log('Processing data:', input.data);
    
    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      processed: input.data.toUpperCase(),
      timestamp: new Date().toISOString()
    };
  });
  
  try {
    const result = await customWorkflow({ data: 'hello world' });
    console.log('✅ Custom workflow result:', result);
  } catch (error) {
    console.error('❌ Error in custom workflow:', error);
  }
}

/**
 * Example: Tool Execution with Galileo Logging
 * 
 * This function demonstrates how to use Galileo logging with tool execution.
 */
async function runToolExample(): Promise<void> {
  console.log('\n🛠️  Starting Tool Example');
  
  // Create a simple tool with Galileo logging
  const simpleTool = log({ 
    name: 'simple-calculator', 
    spanType: 'tool' 
  }, async (a: number, b: number, operation: 'add' | 'subtract' | 'multiply') => {
    console.log(`Performing ${operation} on ${a} and ${b}`);
    
    switch (operation) {
      case 'add':
        return a + b;
      case 'subtract':
        return a - b;
      case 'multiply':
        return a * b;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  });
  
  try {
    const result1 = await simpleTool(10, 5, 'add');
    console.log('✅ Addition result:', result1);
    
    const result2 = await simpleTool(10, 5, 'multiply');
    console.log('✅ Multiplication result:', result2);
    
  } catch (error) {
    console.error('❌ Error in tool execution:', error);
  }
}

/**
 * Main Example Runner
 * 
 * This function runs all the examples in sequence, demonstrating
 * different aspects of the Galileo integration.
 */
async function runAllExamples(): Promise<void> {
  console.log('🚀 Starting Galileo Integration Examples');
  console.log('==========================================');
  
  try {
    // Run the weather workflow example
    await runWeatherWorkflowExample();
    
    // Run the custom workflow example
    await runCustomWorkflowExample();
    
    // Run the tool example
    await runToolExample();
    
    console.log('\n🎉 All examples completed successfully!');
    console.log('📈 Check your Galileo dashboard for observability data');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  } finally {
    // Graceful shutdown - Galileo will automatically flush data
    console.log('\n🔄 Shutting down gracefully...');
    process.exit(0);
  }
}

// Run the examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

export {
  runWeatherWorkflowExample,
  runCustomWorkflowExample,
  runToolExample,
  runAllExamples
};
