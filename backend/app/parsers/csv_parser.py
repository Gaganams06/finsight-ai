import csv
import io
import re
from typing import List, Dict, Any, Tuple, Optional
import pandas as pd
from .base import clean_amount, parse_date_str, mask_account_number, detect_bank

DATE_HEADERS = {"date", "txn date", "transaction date", "value date", "trans date", "booking date"}
DESC_HEADERS = {"narration", "particulars", "description", "details", "remarks", "transaction details", "transaction remarks"}
DEBIT_HEADERS = {"debit", "withdrawal", "dr", "withdrawals", "debit amount", "withdrawn", "dr amount"}
CREDIT_HEADERS = {"credit", "deposit", "cr", "deposits", "credit amount", "deposited", "cr amount"}
BALANCE_HEADERS = {"balance", "closing balance", "bal", "available balance", "net balance"}
AMOUNT_HEADERS = {"amount", "txn amount", "transaction amount"}
TYPE_HEADERS = {"type", "cr/dr", "txn type", "d/c"}

def parse_csv_statement(content_bytes: bytes, filename: str = "") -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Robustly parses bank statement CSV files, handling preamble lines, varied delimiters,
    and different column naming conventions from major banks (SBI, HDFC, ICICI, etc.).
    """
    raw_text = None
    for enc in ("utf-8-sig", "utf-8", "latin-1", "cp1252"):
        try:
            raw_text = content_bytes.decode(enc)
            break
        except UnicodeDecodeError:
            continue
            
    if raw_text is None:
        raw_text = content_bytes.decode("utf-8", errors="replace")

    lines = [line.strip() for line in raw_text.splitlines() if line.strip()]
    if not lines:
        return [], {"bank": "Unknown", "account_mask": "•••• •••• 8294"}

    account_mask = mask_account_number(raw_text[:2000])
    bank_detected = detect_bank(raw_text[:2000], filename)

    # Sniff delimiter
    sample_snippet = "\n".join(lines[:25])
    delimiter = ","
    try:
        sniffed = csv.Sniffer().sniff(sample_snippet, delimiters=",;\t|")
        delimiter = sniffed.delimiter
    except Exception:
        for cand in [",", ";", "\t", "|"]:
            if sample_snippet.count(cand) > len(lines[:25]):
                delimiter = cand
                break

    # Locate the header row
    header_idx = -1
    col_map = {}

    for idx, line in enumerate(lines[:35]):
        # Parse row using csv reader to honor quotes
        row = list(csv.reader([line], delimiter=delimiter))[0]
        cleaned_cells = [c.lower().strip() for c in row]
        
        has_date = any(any(dh in cell for dh in DATE_HEADERS) for cell in cleaned_cells)
        has_desc = any(any(dh in cell for dh in DESC_HEADERS) for cell in cleaned_cells)
        has_amt = any(any(h in cell for h in (DEBIT_HEADERS | CREDIT_HEADERS | AMOUNT_HEADERS)) for cell in cleaned_cells)

        if has_date and (has_desc or has_amt):
            header_idx = idx
            # Map columns
            for c_idx, cell in enumerate(cleaned_cells):
                if any(dh == cell or cell.startswith(dh) for dh in DATE_HEADERS) and "date" not in col_map:
                    col_map["date"] = c_idx
                elif any(dh in cell for dh in DESC_HEADERS) and "description" not in col_map:
                    col_map["description"] = c_idx
                elif any(dh in cell for dh in DEBIT_HEADERS) and "debit" not in col_map:
                    col_map["debit"] = c_idx
                elif any(dh in cell for dh in CREDIT_HEADERS) and "credit" not in col_map:
                    col_map["credit"] = c_idx
                elif any(dh in cell for dh in BALANCE_HEADERS) and "balance" not in col_map:
                    col_map["balance"] = c_idx
                elif any(dh in cell for dh in AMOUNT_HEADERS) and "amount" not in col_map:
                    col_map["amount"] = c_idx
                elif any(dh in cell for dh in TYPE_HEADERS) and "type" not in col_map:
                    col_map["type"] = c_idx
            break

    if header_idx == -1 or "date" not in col_map:
        # Fallback: Try reading via pandas with header auto-detection
        try:
            df = pd.read_csv(io.StringIO(raw_text), delimiter=delimiter)
            # Find date column
            for col in df.columns:
                col_lower = str(col).lower()
                if any(dh in col_lower for dh in DATE_HEADERS):
                    col_map["date"] = df.columns.get_loc(col)
                elif any(dh in col_lower for dh in DESC_HEADERS):
                    col_map["description"] = df.columns.get_loc(col)
                elif any(dh in col_lower for dh in DEBIT_HEADERS):
                    col_map["debit"] = df.columns.get_loc(col)
                elif any(dh in col_lower for dh in CREDIT_HEADERS):
                    col_map["credit"] = df.columns.get_loc(col)
                elif any(dh in col_lower for dh in BALANCE_HEADERS):
                    col_map["balance"] = df.columns.get_loc(col)
            header_idx = 0
            lines = [",".join([str(x) for x in row]) for row in df.values]
        except Exception:
            return [], {"bank": bank_detected, "account_mask": account_mask}

    # Extract transactions
    transactions = []
    current_balance = 0.0
    has_known_balance = False

    csv_reader = csv.reader(lines[header_idx + 1:], delimiter=delimiter)
    row_count = 0

    for row in csv_reader:
        if not row or len(row) <= max(col_map.values(), default=0):
            continue

        raw_date = row[col_map["date"]] if "date" in col_map and col_map["date"] < len(row) else ""
        date_iso = parse_date_str(raw_date)
        if not date_iso:
            continue

        raw_desc = row[col_map["description"]] if "description" in col_map and col_map["description"] < len(row) else "Transaction"
        raw_desc = re.sub(r"\s+", " ", str(raw_desc)).strip()
        if not raw_desc or raw_desc.lower() in ("total", "opening balance", "closing balance", "brought forward"):
            continue

        debit = 0.0
        credit = 0.0

        if "debit" in col_map and col_map["debit"] < len(row):
            debit = clean_amount(row[col_map["debit"]])
        if "credit" in col_map and col_map["credit"] < len(row):
            credit = clean_amount(row[col_map["credit"]])

        # If unified amount column with Type column
        if debit == 0.0 and credit == 0.0 and "amount" in col_map and col_map["amount"] < len(row):
            amt = clean_amount(row[col_map["amount"]])
            txn_type = ""
            if "type" in col_map and col_map["type"] < len(row):
                txn_type = str(row[col_map["type"]]).strip().upper()
            
            if "CR" in txn_type or "CREDIT" in txn_type or "DEPOSIT" in txn_type:
                credit = amt
            elif "DR" in txn_type or "DEBIT" in txn_type or "WITHDRAWAL" in txn_type:
                debit = amt
            else:
                # Check sign
                raw_amt_str = str(row[col_map["amount"]])
                if "-" in raw_amt_str:
                    debit = amt
                else:
                    debit = amt

        # Ignore empty rows where both debit and credit are 0
        if debit == 0.0 and credit == 0.0:
            continue

        balance = None
        if "balance" in col_map and col_map["balance"] < len(row):
            raw_bal = row[col_map["balance"]]
            if raw_bal and str(raw_bal).strip():
                balance = clean_amount(raw_bal)
                current_balance = balance
                has_known_balance = True

        row_count += 1
        txn_id = f"txn_{row_count}_{date_iso.replace('-', '')}"

        transactions.append({
            "id": txn_id,
            "date": date_iso,
            "description": raw_desc,
            "debit": round(debit, 2),
            "credit": round(credit, 2),
            "balance": round(balance, 2) if balance is not None else None,
            "account_mask": account_mask
        })

    # Sort transactions chronologically
    transactions.sort(key=lambda x: x["date"])

    # If balance was not explicitly provided in all rows, reconstruct rolling balance
    if transactions:
        first_bal = transactions[0]["balance"]
        running_bal = first_bal if first_bal is not None else 50000.0  # sensible baseline
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
