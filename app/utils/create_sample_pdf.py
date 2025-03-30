import os
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from io import BytesIO

def create_sample_pdf(output_path):
    """Create a sample PDF with form fields for testing."""
    # Create a BytesIO buffer
    buffer = BytesIO()
    
    # Create a new PDF with Reportlab
    c = canvas.Canvas(buffer, pagesize=letter)
    c.setFont("Helvetica", 12)
    
    # Add some text
    c.drawString(100, 750, "Sample PDF Form")
    c.drawString(100, 700, "First Name:")
    c.drawString(100, 650, "Last Name:")
    c.drawString(100, 600, "Email:")
    c.drawString(100, 550, "Phone:")
    c.drawString(100, 500, "Address:")
    
    c.save()
    
    # Move to the beginning of the buffer
    buffer.seek(0)
    
    # Create a new PDF with text only (no form fields)
    with open(output_path, "wb") as f:
        f.write(buffer.getvalue())
    
    print(f"Sample PDF created at {output_path}")
    
    # This is a simplified version that creates a text-only PDF,
    # since PyPDF2 doesn't have a simple API for adding form fields.
    # For your app, you can either:
    # 1. Use the existing PDFs which already have form fields
    # 2. Use a more complex solution with pdftk or other libraries

if __name__ == "__main__":
    # Ensure the directory exists
    os.makedirs("../data/pdf_templates", exist_ok=True)
    create_sample_pdf("../data/pdf_templates/sample_form.pdf") 