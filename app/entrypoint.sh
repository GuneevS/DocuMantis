#!/bin/bash
set -e

echo "Starting DocuMantis backend container..."

# Display system information for debugging
echo "Container environment:"
echo "======================"
echo "Python version: $(python --version)"
echo "Python path: $PYTHONPATH"
echo "Current directory: $(pwd)"
echo "======================"

# Create necessary directories
echo "Creating data directories..."
mkdir -p /app/data/pdf_templates /app/data/generated_pdfs

# Set proper permissions
echo "Setting directory permissions..."
chmod -R 777 /app/data

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; do
    echo "PostgreSQL is unavailable - sleeping"
    sleep 2
done
echo "PostgreSQL is up and running"

# Run database migrations - using the full path
echo "Running database migrations..."
cd /app && python -m alembic.config -c /app/app/alembic.ini upgrade head

# Start the application with increased timeout
echo "Launching uvicorn server..."
exec python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload --log-level debug --limit-concurrency 100 --timeout-keep-alive 120
