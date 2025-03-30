# DocuMantis - Financial Advisor PDF Automation Tool

DocuMantis is a local, offline-only web application designed for financial advisors and brokers to streamline client data management and automate PDF form filling.

## Features

- 📋 **Client Management**: Securely capture and store client data
- 📄 **PDF Automation**: Upload PDF templates and automatically fill them with client data
- 🔍 **Intelligent Field Mapping**: Smart recognition of form fields with similar purposes
- 🔒 **Data Privacy**: All data is stored locally with no cloud dependencies
- 🖥️ **Modern Interface**: Clean, responsive UI for efficient workflow

## Getting Started

### Prerequisites

- Python 3.8+ with pip
- Node.js 16+ with npm
- Docker (optional, for containerized deployment)

### Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd DocuMantis
```

2. **Set up Python environment**

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

3. **Set up Frontend**

```bash
cd frontend
npm install
cd ..
```

4. **Run in Development Mode**

Start both servers with a single command:

```bash
# From project root
cd app
python -m uvicorn main:app --reload --port 8001
```

In a separate terminal:

```bash
cd frontend
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8001
- API Documentation: http://localhost:8001/docs

### Docker Deployment

For production or simplified setup, you can use Docker:

1. **Build and start containers**

```bash
# Production setup
./docker-start-prod.sh

# OR manually
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

2. **Access the application**

- Frontend: http://localhost
- Backend API: http://localhost:8001
- API Documentation: http://localhost:8001/docs

3. **Stop containers**

```bash
./docker-stop.sh

# OR manually
docker-compose -f docker-compose.prod.yml down
```

## Project Structure

```
DocuMantis/
├── app/                    # Backend (FastAPI)
│   ├── models/             # Database models
│   ├── schemas/            # Pydantic schemas
│   ├── services/           # Business logic
│   ├── utils/              # Utility scripts
│   └── main.py             # Main application entry point
├── data/                   # Data storage
│   ├── generated_pdfs/     # Output PDFs
│   ├── pdf_templates/      # PDF form templates
│   └── sample_forms/       # Example forms for testing
├── frontend/               # Frontend (React)
│   ├── public/             # Static assets
│   └── src/                # Source code
│       ├── components/     # Reusable UI components
│       ├── pages/          # Application pages
│       ├── services/       # API integration
│       └── App.jsx         # Main React component
├── docker-compose.yml      # Docker configuration (dev)
├── docker-compose.prod.yml # Docker configuration (prod)
└── requirements.txt        # Python dependencies
```

## Working with PDF Templates

To use PDF forms:

1. Upload PDF templates through the UI
2. Or place them directly in `data/pdf_templates/`

Example templates are available in `data/sample_forms/` for testing.

## Data Storage

All data is stored locally:
- SQLite database: `data/financial_advisor.db`
- PDF templates: `data/pdf_templates/`
- Generated PDFs: `data/generated_pdfs/`

## Development Utilities

The app includes utility scripts for development purposes:

- **Creating test forms**: `python -m app.utils.create_test_form`
- **Creating sample PDFs**: `python -m app.utils.create_sample_pdf`

## Troubleshooting

### Common Issues

**Backend not starting**
- Check if port 8001 is already in use
- Ensure Python dependencies are installed
- Verify database permissions

**Frontend not starting**
- Check if Node.js dependencies are installed
- Ensure the backend is running

**PDF generation errors**
- Verify PDF template structure
- Check for form field names in the template
- Ensure client data matches expected format

## License

Private - For internal use only

## Contact

For questions or support, please contact the repository owner. 