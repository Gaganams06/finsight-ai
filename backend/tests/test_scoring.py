import pytest
from app.scoring.health_engine import calculate_financial_health_score

def test_high_health_score():
    cashflow_summary = {
        "total_income": 300000.0,
        "total_expenses": 120000.0,
        "savings_rate": 60.0,
        "avg_monthly_burn": 40000.0
    }
    monthly_trends = [
        {"month": "Jan", "income": 100000.0, "expenses": 40000.0},
        {"month": "Feb", "income": 100000.0, "expenses": 39000.0},
        {"month": "Mar", "income": 100000.0, "expenses": 41000.0}
    ]
    category_spends = [
        {"category": "rent", "total_spend": 45000.0},
        {"category": "groceries", "total_spend": 25000.0},
        {"category": "investments", "total_spend": 30000.0}
    ]
    balance_metrics = {
        "average_daily_balance": 180000.0,
        "low_balance_days": 0
    }

    result = calculate_financial_health_score(cashflow_summary, monthly_trends, category_spends, balance_metrics)
    assert result["overall_score"] >= 80
    assert result["tier"] == "Excellent"
    assert len(result["factors"]) == 5

def test_poor_health_score():
    cashflow_summary = {
        "total_income": 100000.0,
        "total_expenses": 115000.0,
        "savings_rate": -15.0,
        "avg_monthly_burn": 38000.0
    }
    monthly_trends = [
        {"month": "Jan", "income": 33000.0, "expenses": 45000.0},
        {"month": "Feb", "income": 33000.0, "expenses": 30000.0},
        {"month": "Mar", "income": 34000.0, "expenses": 40000.0}
    ]
    category_spends = [
        {"category": "emi_loans", "total_spend": 60000.0},  # 60% of income in debt!
        {"category": "food", "total_spend": 35000.0}
    ]
    balance_metrics = {
        "average_daily_balance": 3500.0,
        "low_balance_days": 18
    }

    result = calculate_financial_health_score(cashflow_summary, monthly_trends, category_spends, balance_metrics)
    assert result["overall_score"] < 50
    assert result["tier"] == "Needs Attention"
