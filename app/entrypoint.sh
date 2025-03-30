#!/bin/bash
set -e

echo "Starting PDFeck backend container..."

# Display system information for debugging
echo "Container environment:"
echo "======================"
echo "Python version: $(python --version)"
echo "Python path: $PYTHONPATH"
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"
echo "======================"

# Create necessary directories
echo "Creating data directories..."
mkdir -p /app/data/pdf_templates /app/data/generated_pdfs

# Set proper permissions
echo "Setting directory permissions..."
chmod -R 777 /app/data

# Check for connectivity to other services
echo "Checking network connectivity..."
echo "   - Host networking: $(hostname -I || echo 'Not available')"
echo "   - DNS resolution: $(cat /etc/resolv.conf || echo 'Not available')"

# Wait for any required services (if we add database services later)
echo "Starting PDFeck backend service..."

# Run the application with the proper Python path
echo "Launching uvicorn server..."
exec python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload --log-level debug 