import pytest
from app.categorization.engine import categorizer

def test_salary_categorization():
    cat, merch = categorizer.categorize_transaction("SALARY CR FOR MARCH 2024 INFOSYS", debit=0.0, credit=95000.0)
    assert cat == "salary_income"

def test_upi_swiggy_categorization():
    cat, merch = categorizer.categorize_transaction("UPI/DR/418290/SWIGGY BANGALORE/swiggy@icici", debit=450.0, credit=0.0)
    assert cat == "food"
    assert "Swiggy" in merch

def test_netflix_subscription():
    cat, merch = categorizer.categorize_transaction("POS DR NETFLIX SERVICES MUMBAI", debit=649.0, credit=0.0)
    assert cat == "entertainment"
    assert "Netflix" in merch

def test_loan_emi():
    cat, merch = categorizer.categorize_transaction("NACH DR HDFC AUTO LOAN EMI PAYMENT", debit=12500.0, credit=0.0)
    assert cat == "emi_loans"

def test_grocery():
    cat, merch = categorizer.categorize_transaction("UPI/DR/391029/BLINKIT QUICK COMMERCE/blinkit@axis", debit=1850.0, credit=0.0)
    assert cat == "groceries"
    assert "Blinkit" in merch

def test_investments():
    cat, merch = categorizer.categorize_transaction("ACH DR ZERODHA BROKING MUTUAL FUND SIP", debit=10000.0, credit=0.0)
    assert cat == "investments"
    assert "Zerodha" in merch

def test_ml_fallback():
    # A generic dining description not in exact keywords
    cat, merch = categorizer.categorize_transaction("DINNER AT PIZZERIA AND DRINKS", debit=1200.0, credit=0.0)
    assert cat in ("food", "other")
