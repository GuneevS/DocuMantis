#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting DocuMantis Backend Server${NC}"
echo -e "${BLUE}------------------------------------${NC}"

# Check if we're in a virtual environment
if [[ -z "${VIRTUAL_ENV}" ]]; then
    echo -e "${YELLOW}Warning: No active Python virtual environment detected.${NC}"
    if [[ -d "../venv" ]]; then
        echo -e "${BLUE}Activating virtual environment from ../venv${NC}"
        source "../venv/bin/activate"
    else
        echo -e "${RED}Error: No virtual environment found at ../venv${NC}"
        echo -e "${RED}Please create and activate a virtual environment first:${NC}"
        echo -e "${YELLOW}cd .. && python -m venv venv && source venv/bin/activate${NC}"
        exit 1
    fi
fi

# Ensure data directories exist
mkdir -p "../data/pdf_templates" "../data/generated_pdfs"

# Start the server
echo -e "${BLUE}Starting FastAPI server on http://localhost:8001${NC}"
python -m uvicorn main:app --reload --port 8001 