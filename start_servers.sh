#!/bin/bash

echo "Starting CodeCanvas Development Servers..."
echo

# Start PHP Backend Server
echo "Starting PHP Backend Server..."
php -S localhost:8000 -t public/ &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start React Frontend Server
echo "Starting React Frontend Server..."
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "CodeCanvas Development Servers Started"
echo "========================================"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:8000"
echo
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait