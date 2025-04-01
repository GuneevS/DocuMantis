#!/bin/bash

# Determine which compose file to use
if [ -f "docker-compose.override.yml" ]; then
    COMPOSE_FILE="docker-compose.override.yml"
elif [ -f ".env" ] && grep -q "PRODUCTION=true" .env; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.yml"
fi

echo "Stopping DocuMantis containers using $COMPOSE_FILE..."

# Stop containers
docker-compose -f $COMPOSE_FILE down

echo "DocuMantis has been stopped."
