import re
from datetime import datetime
from typing import Optional, Tuple, Dict, Any, List
from dateutil import parser as date_parser

KNOWN_BANKS = [
    ("hdfc", "HDFC Bank"),
    ("icici", "ICICI Bank"),
    ("state bank of india", "State Bank of India (SBI)"),
    ("sbi", "State Bank of India (SBI)"),
    ("canara", "Canara Bank"),
    ("axis", "Axis Bank"),
    ("kotak", "Kotak Mahindra Bank"),
    ("punjab national bank", "Punjab National Bank"),
    ("pnb", "Punjab National Bank"),
    ("bank of baroda", "Bank of Baroda"),
    ("indusind", "IndusInd Bank"),
    ("idfc", "IDFC FIRST Bank"),
    ("yes bank", "Yes Bank"),
    ("chase", "Chase Bank"),
    ("wells fargo", "Wells Fargo"),
    ("bank of america", "Bank of America"),
    ("citibank", "Citibank")
]

def clean_amount(val: Any) -> float:
    """Converts diverse string/numeric amount inputs into a clean float."""
    if val is None or (isinstance(val, float) and (val != val or val is None)):
        return 0.0
    if isinstance(val, (int, float)):
        return abs(float(val))
    
    val_str = str(val).strip()
    if not val_str or val_str.lower() in ("-", "--", "nil", "na", "n/a", "none"):
        return 0.0

    # Remove currency symbols and non-numeric chars except digits, minus, dot
    cleaned = re.sub(r"[₹$,\s]", "", val_str)
    
    # Handle parentheses for debit/negative e.g. (1,200.00)
    if cleaned.startswith("(") and cleaned.endswith(")"):
        cleaned = cleaned[1:-1]
        
    # Check if Dr/Cr is suffix
    cleaned = re.sub(r"(?i)(dr|cr)", "", cleaned).strip()

    try:
        return abs(float(cleaned))
    except (ValueError, TypeError):
        return 0.0

def parse_date_str(date_str: Any) -> Optional[str]:
    """Parse ambiguous date string into standard ISO YYYY-MM-DD, prioritizing day-first."""
    if not date_str:
        return None
    if isinstance(date_str, datetime):
        return date_str.strftime("%Y-%m-%d")

    s = str(date_str).strip()
    if not s:
        return None

    # Common Indian formats: 12/04/2024, 12-04-2024, 12-Apr-2024, 12-April-2024
    try:
        dt = date_parser.parse(s, dayfirst=True, fuzzy=False)
        return dt.strftime("%Y-%m-%d")
    except Exception:
        pass

    # Try fuzzy parse
    try:
        dt = date_parser.parse(s, dayfirst=True, fuzzy=True)
        return dt.strftime("%Y-%m-%d")
    except Exception:
        return None

def mask_account_number(text: str) -> str:
    """Detects account number in text or generates consistent masked fallback."""
    # Look for account numbers: 9 to 18 consecutive digits
    match = re.search(r"(?:a/c|acct|account|acc\.?|no\.?)[\s:#-]*(\d{8,18})", text, re.IGNORECASE)
    if match:
        acc = match.group(1)
        last4 = acc[-4:]
        return f"•••• •••• {last4}"
    
    # Check for standalone 10-16 digit numbers
    match_standalone = re.search(r"\b\d{10,18}\b", text)
    if match_standalone:
        acc = match_standalone.group(0)
        return f"•••• •••• {acc[-4:]}"

    return "•••• •••• 8294"

def detect_bank(sample_text: str, filename: str = "") -> str:
    # 1. Prioritize filename matches first
    fn_lower = filename.lower()
    for key, name in KNOWN_BANKS:
        if key in fn_lower:
            return name

    # 2. Check header text with word boundaries
    text_lower = sample_text[:1000].lower()
    for key, name in KNOWN_BANKS:
        pattern = r"\b" + re.escape(key) + r"\b"
        if re.search(pattern, text_lower):
            return name

    return "Standard Bank Statement"
