#!/bin/bash

echo "Starting DocuMantis in development mode..."

# Create Dockerfile.backend for development if it doesn't exist
if [ ! -f "Dockerfile.backend" ]; then
    echo "Creating Dockerfile.backend..."
    cat > Dockerfile.backend <<EOL
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && \\
    apt-get install -y --no-install-recommends \\
    build-essential \\
    curl \\
    postgresql-client && \\
    apt-get clean && \\
    rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/

# Create necessary directories
RUN mkdir -p ./data/pdf_templates ./data/generated_pdfs

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Make entrypoint script executable
RUN chmod +x ./app/entrypoint.sh

# Expose port
EXPOSE 8001

# Use entrypoint script
ENTRYPOINT ["./app/entrypoint.sh"]
EOL
    chmod +x Dockerfile.backend
fi

# Check if docker-compose.yml exists
if [ ! -f "docker-compose.yml" ]; then
    echo "docker-compose.yml not found. Please create it first."
    exit 1
fi

# Build and start containers
docker-compose up -d --build

echo "DocuMantis is starting..."
echo "Frontend will be available at: http://localhost"
echo "API will be available at: http://localhost:8001"
echo "API documentation will be available at: http://localhost:8001/docs"
echo ""
echo "Use './docker-stop.sh' to stop the application"
