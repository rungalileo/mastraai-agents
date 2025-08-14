#!/bin/bash

# Mastra Galileo Integration - Quick Start Script
# This script automates the initial setup process

set -e  # Exit on any error

echo "🚀 Mastra Galileo Integration - Quick Start"
echo "=========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -f ".env.example" ]; then
    echo "❌ Error: Please run this script from the mastra-galileo directory"
    echo "   cd mastra-galileo"
    echo "   ./quick-start.sh"
    exit 1
fi

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created!"
    echo ""
    echo "⚠️  IMPORTANT: You need to edit .env and add your API keys:"
    echo "   - GALILEO_API_KEY=your_galileo_api_key_here"
    echo "   - OPENAI_API_KEY=your_openai_api_key_here"
    echo ""
    echo "   Get your Galileo API key from: https://app.galileo.ai"
    echo ""
    read -p "Press Enter after you've added your API keys to .env..."
else
    echo "✅ .env file already exists"
fi

# Step 3: Test setup
echo "🧪 Testing Galileo setup..."
if npm run test:setup; then
    echo "✅ Setup verification passed!"
else
    echo "❌ Setup verification failed!"
    echo "Please check your .env file and API keys"
    exit 1
fi

# Step 4: Start development server
echo ""
echo "🎉 Setup complete! Starting development server..."
echo "   - API: http://localhost:4111/api"
echo "   - Playground: http://localhost:4111"
echo "   - Galileo Dashboard: https://app.galileo.ai"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
