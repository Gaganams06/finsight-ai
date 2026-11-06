import io
import re
from typing import List, Dict, Any, Tuple
import pdfplumber
from .base import clean_amount, parse_date_str, mask_account_number, detect_bank
from .csv_parser import DATE_HEADERS, DESC_HEADERS, DEBIT_HEADERS, CREDIT_HEADERS, BALANCE_HEADERS, AMOUNT_HEADERS

DATE_REGEX = re.compile(r"^\s*(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s+[A-Za-z]{3}\s+\d{2,4})")
AMOUNT_REGEX = re.compile(r"[\d,]+\.\d{2}")

def parse_pdf_statement(content_bytes: bytes, filename: str = "") -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Parses bank statements in PDF format in-memory using pdfplumber.
    Supports both table-based PDFs and unstructured text-line statements.
    """
    transactions = []
    full_text_meta = ""
    account_mask = "•••• •••• 8294"
    bank_detected = "Standard Bank Statement"

    try:
        with pdfplumber.open(io.BytesIO(content_bytes)) as pdf:
            # Check metadata from first 2 pages
            for page in pdf.pages[:2]:
                text = page.extract_text() or ""
                full_text_meta += text + "\n"

            account_mask = mask_account_number(full_text_meta)
            bank_detected = detect_bank(full_text_meta, filename)

            # Strategy 1: Table Extraction across pages
            row_count = 0
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    if not table or len(table) < 2:
                        continue
                    
                    # Find header row in table
                    col_map = {}
                    header_row_idx = -1
                    for r_idx, row in enumerate(table[:5]):
                        cleaned = [str(c).lower().strip() if c else "" for c in row]
                        if any(any(dh in cell for dh in DATE_HEADERS) for cell in cleaned) and \
                           any(any(dh in cell for dh in (DESC_HEADERS | DEBIT_HEADERS | CREDIT_HEADERS)) for cell in cleaned):
                            header_row_idx = r_idx
                            for c_idx, cell in enumerate(cleaned):
                                if any(dh in cell for dh in DATE_HEADERS) and "date" not in col_map:
                                    col_map["date"] = c_idx
                                elif any(dh in cell for dh in DESC_HEADERS) and "description" not in col_map:
                                    col_map["description"] = c_idx
                                elif any(dh in cell for dh in DEBIT_HEADERS) and "debit" not in col_map:
                                    col_map["debit"] = c_idx
                                elif any(dh in cell for dh in CREDIT_HEADERS) and "credit" not in col_map:
                                    col_map["credit"] = c_idx
                                elif any(dh in cell for dh in BALANCE_HEADERS) and "balance" not in col_map:
                                    col_map["balance"] = c_idx
                            break

                    if header_row_idx != -1 and "date" in col_map:
                        for row in table[header_row_idx + 1:]:
                            if not row or len(row) <= max(col_map.values(), default=0):
                                continue

                            date_val = row[col_map["date"]]
                            date_iso = parse_date_str(date_val)
                            if not date_iso:
                                continue

                            raw_desc = row[col_map["description"]] if "description" in col_map and col_map["description"] < len(row) else "Transaction"
                            raw_desc = re.sub(r"\s+", " ", str(raw_desc or "")).strip()

                            debit = clean_amount(row[col_map["debit"]]) if "debit" in col_map and col_map["debit"] < len(row) else 0.0
                            credit = clean_amount(row[col_map["credit"]]) if "credit" in col_map and col_map["credit"] < len(row) else 0.0

                            if debit == 0.0 and credit == 0.0:
                                continue

                            balance = clean_amount(row[col_map["balance"]]) if "balance" in col_map and col_map["balance"] < len(row) else None

                            row_count += 1
                            transactions.append({
                                "id": f"pdf_{row_count}_{date_iso.replace('-', '')}",
                                "date": date_iso,
                                "description": raw_desc or "Transaction",
                                "debit": round(debit, 2),
                                "credit": round(credit, 2),
                                "balance": round(balance, 2) if balance is not None else None,
                                "account_mask": account_mask
                            })

            # Strategy 2: If table extraction produced 0 transactions, parse line-by-line using regex
            if not transactions:
                line_count = 0
                for page in pdf.pages:
                    text = page.extract_text() or ""
                    for line in text.splitlines():
                        line = line.strip()
                        date_match = DATE_REGEX.match(line)
                        if not date_match:
                            continue

                        date_str = date_match.group(1)
                        date_iso = parse_date_str(date_str)
                        if not date_iso:
                            continue

                        # Find all numerical amounts in the line
                        amounts = AMOUNT_REGEX.findall(line)
                        if not amounts:
                            continue

                        # Remainder of line without the leading date
                        remainder = line[date_match.end():].strip()
                        for amt in amounts:
                            remainder = remainder.replace(amt, "")
                        cleaned_desc = re.sub(r"\s+", " ", remainder).strip() or "Transaction"

                        # Typically: if 3 amounts: debit/credit, balance
                        # If 2 amounts: txn amount, balance
                        debit = 0.0
                        credit = 0.0
                        balance = None

                        parsed_amts = [clean_amount(a) for a in amounts]
                        if len(parsed_amts) >= 3:
                            debit = parsed_amts[0]
                            credit = parsed_amts[1]
                            balance = parsed_amts[2]
                        elif len(parsed_amts) == 2:
                            # Check if line contains 'cr' or 'dr'
                            if re.search(r"\b(cr|credit|dep)\b", line, re.IGNORECASE):
                                credit = parsed_amts[0]
                            else:
                                debit = parsed_amts[0]
                            balance = parsed_amts[1]
                        elif len(parsed_amts) == 1:
                            if re.search(r"\b(cr|credit|dep)\b", line, re.IGNORECASE):
                                credit = parsed_amts[0]
                            else:
                                debit = parsed_amts[0]

                        if debit == 0.0 and credit == 0.0:
                            continue

                        line_count += 1
                        transactions.append({
                            "id": f"pdf_line_{line_count}_{date_iso.replace('-', '')}",
                            "date": date_iso,
                            "description": cleaned_desc,
                            "debit": round(debit, 2),
                            "credit": round(credit, 2),
                            "balance": round(balance, 2) if balance is not None else None,
                            "account_mask": account_mask
                        })

    except Exception as e:
        print(f"Error parsing PDF: {e}")

    transactions.sort(key=lambda x: x["date"])

    if transactions:
        first_bal = transactions[0]["balance"]
        running_bal = first_bal if first_bal is not None else 50000.0
        for txn in transactions:
            if txn["balance"] is None:
                running_bal = running_bal + txn["credit"] - txn["debit"]
                txn["balance"] = round(running_bal, 2)
            else:
                running_bal = txn["balance"]

    return transactions, {
        "bank": bank_detected,
        "account_mask": account_mask
    }
