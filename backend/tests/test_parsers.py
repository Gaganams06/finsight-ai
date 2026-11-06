import os
import pytest
from app.parsers.csv_parser import parse_csv_statement
from app.parsers.xlsx_parser import parse_xlsx_statement
from app.parsers.base import clean_amount, parse_date_str, mask_account_number

def test_clean_amount():
    assert clean_amount("1,250.50") == 1250.50
    assert clean_amount("₹45,000.00") == 45000.00
    assert clean_amount("$100.25") == 100.25
    assert clean_amount("(500.00)") == 500.00
    assert clean_amount("1200.00 Cr") == 1200.00
    assert clean_amount("-") == 0.0
    assert clean_amount(None) == 0.0

def test_parse_date_str():
    assert parse_date_str("01/02/2024") == "2024-02-01"
    assert parse_date_str("2024-05-15") == "2024-05-15"
    assert parse_date_str("15-Jan-2024") == "2024-01-15"

def test_mask_account_number():
    assert "4129" in mask_account_number("Account No: 501004129")
    assert "•••• ••••" in mask_account_number("Customer a/c 1234567890123")

def test_sbi_csv_parsing():
    sample_path = os.path.join(os.path.dirname(__file__), "..", "..", "samples", "sample_statement_sbi.csv")
    with open(sample_path, "rb") as f:
        content = f.read()

    txns, meta = parse_csv_statement(content, "sample_sbi.csv")
    assert len(txns) >= 20
    assert "SBI" in meta["bank"] or "State Bank" in meta["bank"]
    assert txns[0]["date"] == "2024-01-01"
    assert txns[0]["credit"] == 85000.0
    assert txns[1]["debit"] == 22000.0

def test_hdfc_xlsx_parsing():
    sample_path = os.path.join(os.path.dirname(__file__), "..", "..", "samples", "sample_statement_hdfc.xlsx")
    with open(sample_path, "rb") as f:
        content = f.read()

    txns, meta = parse_xlsx_statement(content, "sample_hdfc.xlsx")
    assert len(txns) >= 15
    assert "HDFC" in meta["bank"]
    assert any(t["credit"] == 135000.0 for t in txns)
    assert any("NETFLIX" in t["description"] for t in txns)

def test_canara_pdf_parsing():
    sample_path = os.path.join(os.path.dirname(__file__), "..", "..", "samples", "sample_statement_canara.pdf")
    if os.path.exists(sample_path):
        from app.parsers.pdf_parser import parse_pdf_statement
        with open(sample_path, "rb") as f:
            content = f.read()
        txns, meta = parse_pdf_statement(content, "sample_statement_canara.pdf")
        assert len(txns) >= 15
        assert "Canara" in meta["bank"]
