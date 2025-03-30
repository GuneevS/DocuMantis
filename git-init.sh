#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}DocuMantis Git Repository Initializer${NC}"
echo -e "${BLUE}--------------------------------${NC}"

# Initialize a new Git repository
echo -e "${BLUE}Initializing a new Git repository...${NC}"
git init

# Add all files
echo -e "${BLUE}Adding all files to the repository...${NC}"
git add .

echo -e "${YELLOW}Repository initialized!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Configure your remote: ${BLUE}git remote add origin <your-repo-url>${NC}"
echo -e "2. Make your first commit: ${BLUE}git commit -m \"Initial commit\"${NC}"
echo -e "3. Push to remote: ${BLUE}git push -u origin main${NC}" 