from typing import List, Dict, Any, Tuple
from ..categorization.engine import categorizer
from ..categorization.keywords import CATEGORY_METADATA
from .cashflow import analyze_cashflow
from .merchants import analyze_merchants_and_subscriptions
from .anomalies import detect_anomalies
from .balances import analyze_balances
from ..scoring.health_engine import calculate_financial_health_score
from ..recommendations.rule_engine import generate_recommendations

def process_statement_pipeline(
    transactions: List[Dict[str, Any]], 
    meta: Dict[str, Any], 
    filename: str = ""
) -> Dict[str, Any]:
    """
    Executes the complete in-memory financial intelligence pipeline:
    Categorization -> Cashflow -> Subscriptions -> Anomalies -> Balances -> Health Scoring -> Recommendations.
    """
    if not transactions:
        raise ValueError("No valid transaction rows found in the provided statement.")

    # 1. Categorize each transaction & extract clean merchant
    for txn in transactions:
        cat, merch = categorizer.categorize_transaction(
            txn["description"], 
            txn["debit"], 
            txn["credit"]
        )
        txn["category"] = cat
        txn["merchant"] = merch
        txn["is_anomaly"] = False

    # 2. Cashflow & Monthly Trends
    monthly_trends, cashflow_summary = analyze_cashflow(transactions)

    # 3. Category Breakdown (Expenses only)
    cat_spend_map = {}
    total_debit = sum(t["debit"] for t in transactions)

    for txn in transactions:
        d = txn["debit"]
        if d <= 0:
            continue
        c = txn["category"]
        if c not in cat_spend_map:
            meta_info = CATEGORY_METADATA.get(c, {"label": c.replace("_", " ").title(), "color": "#64748b"})
            cat_spend_map[c] = {
                "category": c,
                "label": meta_info["label"],
                "total_spend": 0.0,
                "percentage": 0.0,
                "transaction_count": 0,
                "color": meta_info["color"]
            }
        cat_spend_map[c]["total_spend"] += d
        cat_spend_map[c]["transaction_count"] += 1

    category_breakdown = list(cat_spend_map.values())
    for item in category_breakdown:
        item["total_spend"] = round(item["total_spend"], 2)
        item["percentage"] = round((item["total_spend"] / total_debit * 100), 1) if total_debit > 0 else 0.0

    category_breakdown.sort(key=lambda x: x["total_spend"], reverse=True)

    # 4. Top Merchants & Recurring Subscriptions
    top_merchants, recurring_subscriptions = analyze_merchants_and_subscriptions(transactions)

    # 5. Anomalies
    anomalies = detect_anomalies(transactions)
    anomaly_ids = {a["id"] for a in anomalies}
    # Match back to transactions
    for txn in transactions:
        for anom in anomalies:
            if txn["date"] == anom["date"] and abs(txn["debit"] - anom["amount"]) < 0.01:
                txn["is_anomaly"] = True
                break

    # 6. Balances & ADB
    daily_balances, balance_metrics = analyze_balances(transactions)

    # 7. Health Score (0-100)
    health_score = calculate_financial_health_score(
        cashflow_summary,
        monthly_trends,
        category_breakdown,
        balance_metrics
    )

    # 8. Rule-based Recommendations
    recommendations = generate_recommendations(
        cashflow_summary,
        monthly_trends,
        category_breakdown,
        recurring_subscriptions,
        anomalies,
        balance_metrics
    )

    # Construct Account Metadata
    start_date = transactions[0]["date"]
    end_date = transactions[-1]["date"]

    account_meta = {
        "account_mask": meta.get("account_mask", "•••• •••• 8294"),
        "bank_detected": meta.get("bank", "Standard Bank Statement"),
        "start_date": start_date,
        "end_date": end_date,
        "duration_months": cashflow_summary.get("duration_months", 1),
        "currency": "₹",
        "filename": filename or "Uploaded Statement"
    }

    summary_metrics = {
        "total_income": cashflow_summary["total_income"],
        "total_expenses": cashflow_summary["total_expenses"],
        "net_savings": cashflow_summary["net_savings"],
        "savings_rate": cashflow_summary["savings_rate"],
        "average_daily_balance": balance_metrics["average_daily_balance"],
        "low_balance_days": balance_metrics["low_balance_days"],
        "total_transactions": len(transactions),
        "avg_monthly_burn": cashflow_summary["avg_monthly_burn"],
        "estimated_runway_months": cashflow_summary["estimated_runway_months"]
    }

    return {
        "success": True,
        "meta": account_meta,
        "summary": summary_metrics,
        "health_score": health_score,
        "monthly_trends": monthly_trends,
        "category_breakdown": category_breakdown,
        "top_merchants": top_merchants,
        "recurring_subscriptions": recurring_subscriptions,
        "anomalies": anomalies,
        "daily_balances": daily_balances,
        "recommendations": recommendations,
        "transactions": transactions,
        "privacy_notice": "Statement analyzed strictly in-memory. Zero database retention."
    }
