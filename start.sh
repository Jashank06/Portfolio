#!/bin/bash

# Portfolio Quick Start Script
# This script starts both frontend and backend servers

echo "🚀 Starting Portfolio Website..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if node_modules exists in client
if [ ! -d "client/node_modules" ]; then
    echo "${BLUE}📦 Installing client dependencies...${NC}"
    cd client && npm install && cd ..
    echo "${GREEN}✅ Client dependencies installed!${NC}"
    echo ""
fi

# Check if node_modules exists in server
if [ ! -d "server/node_modules" ]; then
    echo "${BLUE}📦 Installing server dependencies...${NC}"
    cd server && npm install && cd ..
    echo "${GREEN}✅ Server dependencies installed!${NC}"
    echo ""
fi

# Start both servers
echo "${BLUE}🎬 Starting servers...${NC}"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Use trap to kill both processes on Ctrl+C
trap 'kill $CLIENT_PID $SERVER_PID; exit' INT TERM

# Start backend in background
cd server && npm run dev &
SERVER_PID=$!

# Wait a bit for server to start
sleep 2

# Start frontend in background
cd ../client && npm start &
CLIENT_PID=$!

# Wait for both processes
wait $CLIENT_PID $SERVER_PID
