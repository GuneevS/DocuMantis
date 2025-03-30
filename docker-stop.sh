#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}DocuMantis Docker Stop Script${NC}"
echo -e "${BLUE}-------------------------${NC}"

echo -e "${BLUE}Stopping containers...${NC}"
docker-compose -f docker-compose.prod.yml down

echo -e "${GREEN}All containers stopped.${NC}"

# Show status 
echo -e "${BLUE}Container status:${NC}"
docker ps | grep documantis 