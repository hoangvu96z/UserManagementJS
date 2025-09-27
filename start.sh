#!/bin/bash

echo "🚀 Starting Web App - User Management System"
echo "============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "📋 Installing dependencies..."

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies  
echo "🎨 Installing frontend dependencies..."
cd frontend
pnpm install
cd ..

echo "✅ Installation completed!"
echo ""
echo "🚀 To start the application:"
echo "1. Backend:  cd backend && npm run dev"
echo "2. Frontend: cd frontend && pnpm run dev --host"
echo ""
echo "📱 Access the app at: http://localhost:5173"
echo "🔧 Backend API at: http://localhost:3000"
