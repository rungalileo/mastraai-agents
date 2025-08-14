# mastraai-agents

A collection of AI agents built with the Mastra.ai TypeScript framework.

## Step 1: Setting up Mastra Galileo Agent

### Prerequisites
- Node.js >= 20.9.0
- npm or your preferred package manager
- OpenAI API key

### Installation and Setup

1. **Create a new Mastra project**
   ```bash
   npm create mastra@latest
   ```
   Follow the prompts to set up your project. This will create a new directory with all the necessary Mastra scaffolding.

2. **Navigate to your project directory**
   ```bash
   cd your-project-name  # Replace with the actual project name you chose
   ```

3. **Add your OpenAI API key**
   
   Create a `.env` file in your project root and add your OpenAI API key:
   ```bash
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```
   
   Or manually create a `.env` file with:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   
   **Note:** Replace `your_openai_api_key_here` with your actual OpenAI API key. You can get one from [OpenAI's API platform](https://platform.openai.com/api-keys).

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   
   This will start the Mastra development server and you should see your agent running locally.

### Project Structure

After setup, your project will include:
- `package.json` - Project dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables (including your OpenAI API key)
- Agent configuration files and source code

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the project for production
- `npm run start` - Start the production server

### Next Steps

Once you have the basic setup running, you can:
- Customize your agent's instructions and behavior
- Add additional integrations and tools
- Deploy your agent to production

For more detailed documentation, visit [Mastra.ai docs](https://mastra.ai).
