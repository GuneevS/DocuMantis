#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}DocuMantis Docker Production Starter${NC}"
echo -e "${BLUE}----------------------------${NC}"

# Stop any existing containers
echo -e "${BLUE}Stopping any existing containers...${NC}"
docker-compose -f docker-compose.prod.yml down

# Create data directories with proper permissions
echo -e "${BLUE}Setting up data directories...${NC}"
mkdir -p data/pdf_templates data/generated_pdfs
chmod -R 777 data

# Build and start the backend container
echo -e "${BLUE}Building and starting backend container...${NC}"
docker-compose -f docker-compose.prod.yml build backend
docker-compose -f docker-compose.prod.yml up -d backend

# Check if backend service is running
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 5  # Give it a moment to initialize

echo -e "${BLUE}Checking if FastAPI server is running...${NC}"
MAX_ATTEMPTS=10
ATTEMPT=1
BACKEND_READY=false

while [ $ATTEMPT -le $MAX_ATTEMPTS ]; do
    echo -e "${YELLOW}Attempt $ATTEMPT/$MAX_ATTEMPTS${NC}"
    
    if docker exec -it documantis-backend curl -s http://localhost:8001/health > /dev/null; then
        echo -e "${GREEN}Backend health check successful!${NC}"
        BACKEND_READY=true
        break
    else
        echo -e "${YELLOW}Backend not ready yet. Waiting...${NC}"
        ATTEMPT=$((ATTEMPT+1))
        sleep 5
    fi
done

if [ "$BACKEND_READY" = false ]; then
    echo -e "${RED}Backend health check failed after multiple attempts.${NC}"
    echo -e "${BLUE}Backend logs:${NC}"
    docker-compose -f docker-compose.prod.yml logs backend
    echo -e "${YELLOW}You may need to check the backend logs for errors.${NC}"
else
    # Start the frontend container
    echo -e "${BLUE}Starting frontend container...${NC}"
    docker-compose -f docker-compose.prod.yml up -d frontend
    
    # Wait for frontend to start
    sleep 5
    
    echo -e "${GREEN}Application is now running!${NC}"
    echo -e "${BLUE}Frontend: http://localhost${NC}"
    echo -e "${BLUE}Backend API: http://localhost:8001${NC}"
    echo -e "${BLUE}API Documentation: http://localhost:8001/docs${NC}"
    
    # Show container status
    echo -e "${BLUE}Container status:${NC}"
    docker-compose -f docker-compose.prod.yml ps
fi 