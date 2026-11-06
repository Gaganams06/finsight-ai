import io
import re
from typing import List, Dict, Any, Tuple
import openpyxl
from .base import clean_amount, parse_date_str, mask_account_number, detect_bank
from .csv_parser import DATE_HEADERS, DESC_HEADERS, DEBIT_HEADERS, CREDIT_HEADERS, BALANCE_HEADERS, AMOUNT_HEADERS, TYPE_HEADERS

def parse_xlsx_statement(content_bytes: bytes, filename: str = "") -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Parses bank statements in Excel format (.xlsx, .xls) using openpyxl.
    Automatically identifies metadata, header row, and transaction columns.
    """
    wb = openpyxl.load_workbook(io.BytesIO(content_bytes), data_only=True)
    
    # Pick active or first sheet
    ws = wb.active if wb.active else wb.worksheets[0]

    all_rows = []
    meta_text = ""
    for r_idx, row in enumerate(ws.iter_rows(values_only=True)):
        if r_idx < 25:
            meta_text += " ".join([str(c) for c in row if c is not None]) + "\n"
        all_rows.append(row)

    account_mask = mask_account_number(meta_text)
    bank_detected = detect_bank(meta_text, filename)

    # Search for header row
    header_idx = -1
    col_map = {}

    for idx, row in enumerate(all_rows[:40]):
        cleaned_cells = [str(c).lower().strip() if c is not None else "" for c in row]
        has_date = any(any(dh in cell for dh in DATE_HEADERS) for cell in cleaned_cells)
        has_desc = any(any(dh in cell for dh in DESC_HEADERS) for cell in cleaned_cells)
        has_amt = any(any(h in cell for h in (DEBIT_HEADERS | CREDIT_HEADERS | AMOUNT_HEADERS)) for cell in cleaned_cells)

        if has_date and (has_desc or has_amt):
            header_idx = idx
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
        return [], {"bank": bank_detected, "account_mask": account_mask}

    transactions = []
    row_count = 0

    for row in all_rows[header_idx + 1:]:
        if not row or len(row) <= max(col_map.values(), default=0):
            continue

        raw_date = row[col_map["date"]] if "date" in col_map and col_map["date"] < len(row) else None
        date_iso = parse_date_str(raw_date)
        if not date_iso:
            continue

        raw_desc = row[col_map["description"]] if "description" in col_map and col_map["description"] < len(row) else "Transaction"
        raw_desc = re.sub(r"\s+", " ", str(raw_desc)).strip()
        if not raw_desc or raw_desc.lower() in ("total", "opening balance", "closing balance", "brought forward", "none"):
            continue

        debit = 0.0
        credit = 0.0

        if "debit" in col_map and col_map["debit"] < len(row):
            debit = clean_amount(row[col_map["debit"]])
        if "credit" in col_map and col_map["credit"] < len(row):
            credit = clean_amount(row[col_map["credit"]])

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
                debit = amt

        if debit == 0.0 and credit == 0.0:
            continue

        balance = None
        if "balance" in col_map and col_map["balance"] < len(row):
            raw_bal = row[col_map["balance"]]
            if raw_bal is not None and str(raw_bal).strip():
                balance = clean_amount(raw_bal)

        row_count += 1
        txn_id = f"xlsx_{row_count}_{date_iso.replace('-', '')}"

        transactions.append({
            "id": txn_id,
            "date": date_iso,
            "description": raw_desc,
            "debit": round(debit, 2),
            "credit": round(credit, 2),
            "balance": round(balance, 2) if balance is not None else None,
            "account_mask": account_mask
        })

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
