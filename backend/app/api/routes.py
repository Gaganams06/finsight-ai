import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Request, status
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.util import get_remote_address

from ..config import settings
from ..models.schemas import AnalysisResponse
from ..parsers.csv_parser import parse_csv_statement
from ..parsers.xlsx_parser import parse_xlsx_statement
from ..parsers.pdf_parser import parse_pdf_statement
from ..samples.generator import generate_sample_statement
from ..analytics.pipeline import process_statement_pipeline

limiter = Limiter(key_func=get_remote_address)
router = APIRouter()

@router.get("/health", tags=["Health"])
async def health_check():
    """Health probe endpoint."""
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "privacy": "Zero-Storage In-Memory Engine"
    }

@router.get("/sample", response_model=AnalysisResponse, tags=["Demo"])
@limiter.limit("60/minute")
async def get_sample_data(request: Request):
    """
    Returns pre-computed realistic Indian banking data for instant interactive demo.
    """
    try:
        transactions, meta = generate_sample_statement()
        result = process_statement_pipeline(
            transactions, 
            meta, 
            filename="sample_hdfc_bank_statement.csv"
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate sample data: {str(e)}"
        )

@router.post("/upload", response_model=AnalysisResponse, tags=["Analysis"])
@limiter.limit("30/minute")
async def upload_bank_statement(
    request: Request,
    file: UploadFile = File(...)
):
    """
    Accepts PDF, CSV, or XLSX statement (max 10MB), parses transactions in-memory,
    and returns complete financial health analytics and recommendations.
    Never stores files on disk or database.
    """
    filename = file.filename or ""
    ext = os.path.splitext(filename)[1].lower()

    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Supported formats: PDF, CSV, XLSX, XLS."
        )

    # Read up to max allowed size
    content_bytes = await file.read(settings.MAX_UPLOAD_SIZE_BYTES + 1024)
    if len(content_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the 10 MB maximum limit. Received {len(content_bytes) / (1024*1024):.2f} MB."
        )

    if len(content_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded file is empty."
        )

    try:
        if ext == ".csv":
            transactions, meta = parse_csv_statement(content_bytes, filename)
        elif ext in (".xlsx", ".xls"):
            transactions, meta = parse_xlsx_statement(content_bytes, filename)
        elif ext == ".pdf":
            transactions, meta = parse_pdf_statement(content_bytes, filename)
        else:
            raise HTTPException(status_code=400, detail="Unsupported format.")

    except Exception as parse_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Unable to parse statement: {str(parse_err)}. If this PDF is password-protected, please remove the password and retry."
        )

    if not transactions:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="No valid transactions could be extracted. Please check that your statement has a standard table with Date, Narration/Description, and Debit/Credit columns."
        )

    try:
        analysis_result = process_statement_pipeline(transactions, meta, filename)
        return analysis_result
    except Exception as pipeline_err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analytics processing failed: {str(pipeline_err)}"
        )
