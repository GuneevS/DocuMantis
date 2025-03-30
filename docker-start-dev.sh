#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}DocuMantis Docker Development Starter${NC}"
echo -e "${BLUE}--------------------------------${NC}"

# Check Docker daemon status
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Stop any existing containers
echo -e "${BLUE}Stopping any existing containers...${NC}"
docker-compose down

# Create data directories with proper permissions
echo -e "${BLUE}Setting up data directories...${NC}"
mkdir -p data/pdf_templates data/generated_pdfs
chmod -R 777 data

# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Build and start the backend first for better debugging
echo -e "${BLUE}Building and starting backend...${NC}"
docker-compose up -d --build backend

# Wait for backend to be healthy
echo -e "${YELLOW}Waiting for backend to start (this may take a moment)...${NC}"
ATTEMPTS=0
MAX_ATTEMPTS=30
BACKEND_HEALTHY=false

while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
    ATTEMPTS=$((ATTEMPTS+1))
    
    if docker ps | grep "documantis-backend" | grep "(healthy)" > /dev/null; then
        BACKEND_HEALTHY=true
        break
    fi
    
    if [ $ATTEMPTS -eq 1 ]; then
        echo -e "${BLUE}Showing backend logs while waiting:${NC}"
        docker-compose logs backend
    fi
    
    echo -e "${YELLOW}Attempt $ATTEMPTS/$MAX_ATTEMPTS - Backend not healthy yet, waiting 2 seconds...${NC}"
    sleep 2
done

if [ "$BACKEND_HEALTHY" = true ]; then
    echo -e "${GREEN}Backend started successfully!${NC}"
    # Start the frontend
    echo -e "${BLUE}Starting frontend...${NC}"
    docker-compose up -d frontend
    
    echo -e "${GREEN}All containers started!${NC}"
    echo -e "${BLUE}Frontend: http://localhost${NC}"
    echo -e "${BLUE}Backend API: http://localhost:8001${NC}"
    echo -e "${BLUE}API Documentation: http://localhost:8001/docs${NC}"
else
    echo -e "${RED}Backend failed to start in time. Checking logs:${NC}"
    docker-compose logs backend
    echo -e "${YELLOW}You may want to try running:${NC}"
    echo -e "${YELLOW}docker-compose logs backend${NC}"
    exit 1
fi

# Show container status
echo -e "${BLUE}Container status:${NC}"
docker-compose ps

# Ask user if they want to see logs
echo -e "${YELLOW}Do you want to see container logs? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${BLUE}Showing logs (press Ctrl+C to exit)...${NC}"
    docker-compose logs -f
else
    echo -e "${BLUE}You can view logs anytime with:${NC}"
    echo -e "docker-compose logs -f"
fi 