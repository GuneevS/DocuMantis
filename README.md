# DocuMantis - PDF Form Automation Platform

DocuMantis is a powerful web application designed for automating PDF form filling. It features intelligent form field detection and mapping, and is built with a multi-tenant architecture to support SaaS deployment.

## Key Features

- **PDF Form Automation**: Upload PDF forms and automatically fill them with client data
- **Intelligent Field Mapping**: Smart recognition of form fields with similar purposes 
- **Multi-Tenant Architecture**: Built for SaaS deployment with full tenant isolation
- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **PostgreSQL Database**: Robust, scalable data storage
- **Large File Support**: Handles PDF files up to 50MB in size

## Technology Stack

### Backend
- FastAPI (Python web framework)
- PostgreSQL (Database)
- SQLAlchemy ORM
- Alembic (Database migrations)
- PyPDF2 (PDF processing)

### Frontend
- React
- Tailwind CSS
- Vite
- Nginx (for serving static files and as a reverse proxy)

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/documantis.git
   cd documantis
   ```

2. **Start the application with Docker**:
   ```bash
   ./docker-start-dev.sh
   ```

3. **Access the application**:
   - Web UI: http://localhost
   - API: http://localhost:8001
   - API Documentation: http://localhost:8001/docs

### Development Setup

1. **Setup virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Setup frontend**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start development servers**:
   ```bash
   ./start-dev-servers.sh
   ```

## Database Migrations

The application uses Alembic for database migrations:

```bash
# Generate new migration
cd app
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head
```

## Multi-Tenant Support

DocuMantis is designed with multi-tenancy in mind:

- Each tenant has isolated data
- Tenants are identified by a unique slug
- API endpoints support filtering by tenant

Example tenant creation:
```bash
curl -X POST http://localhost:8001/tenants/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Example Corp", "slug": "example-corp"}'
```

## Configuration Notes

### File Upload Limits

The application is configured to handle PDF uploads up to 50MB:
- Nginx is configured with `client_max_body_size 50M`
- FastAPI backend has been optimized for large file uploads
- For larger files, you can adjust these limits in `frontend/nginx.conf` and `app/main.py`

### Database Configuration

The application uses PostgreSQL with these default settings:
- Database name: `documantis`
- Username: `documantis`
- Password: `documantis`

These can be customized through environment variables in the docker-compose file.

## Production Deployment

For production deployment:

```bash
# Build and start production containers
./docker-start-prod.sh
```

For cloud deployment, you'll need to:
1. Configure a PostgreSQL database 
2. Update environment variables for database connection
3. Deploy containers to your cloud provider

## Troubleshooting

Common issues and their solutions:

1. **502 Bad Gateway error when accessing API endpoints**:
   - Ensure PostgreSQL is running and accessible
   - Check if migration files are in the correct location
   - Verify the backend container logs for specific errors

2. **413 Request Entity Too Large error when uploading PDFs**:
   - The application supports files up to 50MB by default
   - For larger files, increase the limits in Nginx and FastAPI configurations

## License

Private - For internal use only

## Contact

For questions or support, please contact the repository owner.
