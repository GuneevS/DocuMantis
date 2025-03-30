import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
import io
import PyPDF2
from PyPDF2 import PdfReader, PdfWriter
import pdfrw

def create_test_form():
    """Create a test PDF form with semantic field groups for testing the intelligent mapping system."""
    output_path = "../data/pdf_templates/intelligent_form_test.pdf"
    
    # Create a PDF with reportlab that displays the structure but without actual form fields
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    
    elements = []
    
    # Title
    elements.append(Paragraph("Financial Advisor Test Form", styles['Title']))
    elements.append(Spacer(1, 12))
    elements.append(Paragraph("This form contains semantic field groups to test intelligent mapping", styles['Normal']))
    elements.append(Spacer(1, 24))
    
    # Personal Information Section
    elements.append(Paragraph("Personal Information", styles['Heading2']))
    elements.append(Spacer(1, 6))
    
    data = [
        ["First Name:", "__________________", "Last Name:", "__________________"],
        ["ID Number:", "__________________", "Date of Birth:", "__________________"],
        ["Tax Number:", "__________________", "Email:", "__________________"],
        ["Phone:", "__________________", "Occupation:", "__________________"]
    ]
    
    table = Table(data, colWidths=[100, 150, 100, 150])
    table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('BACKGROUND', (2, 0), (2, -1), colors.lightgrey),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 24))
    
    # Address Section
    elements.append(Paragraph("Address Information", styles['Heading2']))
    elements.append(Spacer(1, 6))
    
    data = [
        ["Street Address:", "__________________", "City:", "__________________"],
        ["Postal Code:", "__________________", "Country:", "__________________"]
    ]
    
    table = Table(data, colWidths=[100, 150, 100, 150])
    table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('BACKGROUND', (2, 0), (2, -1), colors.lightgrey),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 24))
    
    # Banking Section
    elements.append(Paragraph("Banking Details", styles['Heading2']))
    elements.append(Spacer(1, 6))
    
    data = [
        ["Bank Name:", "__________________", "Account Type:", "__________________"],
        ["Account Number:", "__________________", "Branch Code:", "__________________"]
    ]
    
    table = Table(data, colWidths=[100, 150, 100, 150])
    table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('BACKGROUND', (2, 0), (2, -1), colors.lightgrey),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 24))
    
    # Data Verification Section (duplicate fields with different names)
    elements.append(Paragraph("Data Verification (Repeat Information)", styles['Heading2']))
    elements.append(Spacer(1, 6))
    
    data = [
        ["Customer ID:", "__________________", "Full Name:", "__________________"],
        ["Contact Email:", "__________________", "Contact Phone:", "__________________"],
        ["ID Verification:", "__________________", "Bank Account:", "__________________"]
    ]
    
    table = Table(data, colWidths=[100, 150, 100, 150])
    table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('BACKGROUND', (2, 0), (2, -1), colors.lightgrey),
    ]))
    elements.append(table)
    elements.append(Spacer(1, 24))
    
    doc.build(elements)
    
    # Get the value from the BytesIO buffer
    pdf_content = buffer.getvalue()
    buffer.close()
    
    # Save the form-less PDF
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        f.write(pdf_content)
    
    print(f"Test form created at {output_path}")
    print("IMPORTANT: This is just a visual template. Real PDF forms must be created with Adobe Acrobat or another PDF editor that supports form fields.")
    print("For testing, please use this as a visual guide and create PDF forms with actual form fields.")
    
if __name__ == "__main__":
    create_test_form() 