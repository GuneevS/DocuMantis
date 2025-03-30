#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting DocuMantis Development Servers${NC}"
echo -e "${BLUE}------------------------------------------------------------${NC}"

# Get the absolute path to the project root directory
# This ensures the script works regardless of which directory it's called from
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

echo -e "${BLUE}Project root: ${PROJECT_ROOT}${NC}"

# Create necessary directories if they don't exist
mkdir -p "$PROJECT_ROOT/data/pdf_templates" "$PROJECT_ROOT/data/generated_pdfs"

# Function to clean up child processes when the script is terminated
cleanup() {
    echo -e "\n${GREEN}Shutting down servers...${NC}"
    # Kill all child processes
    pkill -P $$
    exit 0
}

# Set up the cleanup function to run on script termination
trap cleanup SIGINT SIGTERM

# Check if we're in a virtual environment
if [[ -z "${VIRTUAL_ENV}" ]]; then
    echo -e "${YELLOW}Warning: No active Python virtual environment detected.${NC}"
    if [[ -d "$PROJECT_ROOT/venv" ]]; then
        echo -e "${BLUE}Activating virtual environment from $PROJECT_ROOT/venv${NC}"
        source "$PROJECT_ROOT/venv/bin/activate"
    else
        echo -e "${RED}Error: No virtual environment found at $PROJECT_ROOT/venv${NC}"
        echo -e "${RED}Please create and activate a virtual environment first:${NC}"
        echo -e "${YELLOW}python -m venv venv && source venv/bin/activate${NC}"
        exit 1
    fi
fi

# Start the backend server in the background
echo -e "${BLUE}Starting FastAPI backend server on http://localhost:8001${NC}"
cd "$PROJECT_ROOT/app" && python -m uvicorn main:app --reload --port 8001 &
BACKEND_PID=$!

# Give the backend a moment to start up
sleep 2

# Check if package.json exists in frontend directory
if [[ ! -f "$PROJECT_ROOT/frontend/package.json" ]]; then
    echo -e "${RED}Error: Frontend package.json not found!${NC}"
    echo -e "${RED}Please make sure you are running this script from the project root.${NC}"
    cleanup
    exit 1
fi

# Start the frontend server in the background
echo -e "${BLUE}Starting React frontend server${NC}"
cd "$PROJECT_ROOT/frontend" && npm run dev:frontend --host &
FRONTEND_PID=$!

# Keep the script running to manage the background processes
echo -e "${GREEN}Both servers are now running. Press Ctrl+C to stop all servers.${NC}"
echo -e "${BLUE}Backend: http://localhost:8001${NC}"
echo -e "${BLUE}Frontend: Check the URL displayed above (typically http://localhost:5173)${NC}"
echo -e "${BLUE}------------------------------------------------------------${NC}"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 