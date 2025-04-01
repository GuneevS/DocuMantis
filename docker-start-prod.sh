#!/bin/bash

echo "Starting DocuMantis in production mode..."

# Set environment variables for production
export DB_PASSWORD=${DB_PASSWORD:-documantis}  # Use environment variable or default

# Build and start containers using production configuration
docker-compose -f docker-compose.prod.yml up -d --build

echo "DocuMantis production environment is starting..."
echo "Frontend will be available at: http://localhost"
echo "API will be available at: http://localhost:8001"
echo ""
echo "Use './docker-stop.sh' to stop the application"
