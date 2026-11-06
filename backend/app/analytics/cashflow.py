from typing import List, Dict, Any, Tuple
from collections import defaultdict
from datetime import datetime

def analyze_cashflow(transactions: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Computes monthly income, expenses, savings rate, and overall cashflow metrics.
    """
    monthly_data = defaultdict(lambda: {"income": 0.0, "expenses": 0.0, "txns": 0})

    for txn in transactions:
        date_str = txn["date"]
        # Format: YYYY-MM
        month_key = date_str[:7]
        debit = txn["debit"]
        credit = txn["credit"]

        monthly_data[month_key]["income"] += credit
        monthly_data[month_key]["expenses"] += debit
        monthly_data[month_key]["txns"] += 1

    sorted_months = sorted(monthly_data.keys())
    monthly_trends = []

    total_income = 0.0
    total_expenses = 0.0

    for m in sorted_months:
        inc = round(monthly_data[m]["income"], 2)
        exp = round(monthly_data[m]["expenses"], 2)
        savings = round(inc - exp, 2)
        savings_rate = round((savings / inc * 100), 1) if inc > 0 else 0.0
        
        # Friendly month label e.g. "Apr 2024"
        try:
            dt = datetime.strptime(m, "%Y-%m")
            label = dt.strftime("%b %Y")
        except Exception:
            label = m

        monthly_trends.append({
            "month": label,
            "income": inc,
            "expenses": exp,
            "savings": savings,
            "savings_rate": savings_rate,
            "net_cashflow": savings
        })

        total_income += inc
        total_expenses += exp

    num_months = max(1, len(monthly_trends))
    net_savings = round(total_income - total_expenses, 2)
    overall_savings_rate = round((net_savings / total_income * 100), 1) if total_income > 0 else 0.0
    avg_monthly_burn = round(total_expenses / num_months, 2)

    # Runway based on final closing balance
    closing_balance = transactions[-1]["balance"] if transactions and transactions[-1]["balance"] is not None else 0.0
    runway_months = round(closing_balance / avg_monthly_burn, 1) if avg_monthly_burn > 0 else 99.0

    summary = {
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "net_savings": net_savings,
        "savings_rate": overall_savings_rate,
        "avg_monthly_burn": avg_monthly_burn,
        "estimated_runway_months": min(runway_months, 120.0),
        "duration_months": num_months
    }

    return monthly_trends, summary
