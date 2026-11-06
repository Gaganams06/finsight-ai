from typing import List, Dict, Any

def generate_recommendations(
    cashflow_summary: Dict[str, Any],
    monthly_trends: List[Dict[str, Any]],
    category_spends: List[Dict[str, Any]],
    subscriptions: List[Dict[str, Any]],
    anomalies: List[Dict[str, Any]],
    balance_metrics: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """
    Evaluates financial signals and generates prioritized, actionable recommendations.
    """
    recs = []
    total_income = cashflow_summary.get("total_income", 0.0)
    total_expenses = cashflow_summary.get("total_expenses", 0.0)
    savings_rate = cashflow_summary.get("savings_rate", 0.0)
    runway_months = cashflow_summary.get("estimated_runway_months", 0.0)
    low_bal_days = balance_metrics.get("low_balance_days", 0)

    # 1. Emergency Fund & Runway Rule
    if runway_months < 3.0:
        recs.append({
            "id": "rec_emergency_runway",
            "title": "Build a 3-6 Month Emergency Buffer",
            "category": "Savings & Security",
            "priority": "HIGH",
            "impact": "Crucial Safety Cushion",
            "description": f"Your current liquid balance covers approximately {runway_months:.1f} months of average expenses. Financial security requires at least 3 to 6 months of living expenses safely parked in high-yield liquid instruments.",
            "actionable_step": f"Target building an emergency fund of ₹{cashflow_summary.get('avg_monthly_burn', 0)*3:,.0f}. Set up an automated recurring deposit right on salary day."
        })

    # 2. EMI and Debt Burden Rule
    emi_spend = next((c["total_spend"] for c in category_spends if c["category"] == "emi_loans"), 0.0)
    emi_pct = (emi_spend / total_income * 100) if total_income > 0 else 0.0
    if emi_pct > 35.0:
        recs.append({
            "id": "rec_debt_burden",
            "title": "High Debt Servicing Ratio Detected",
            "category": "Debt Management",
            "priority": "HIGH",
            "impact": "Save Interest & Lower Monthly Stress",
            "description": f"Loan EMIs and credit card obligations consume {emi_pct:.1f}% of your earnings (₹{emi_spend:,.0f}). Conventional guidelines recommend keeping fixed debt servicing under 30%.",
            "actionable_step": "Consider refinancing high-interest credit card dues or personal loans into a lower-rate balance transfer, and avoid taking on new consumer installment schemes."
        })

    # 3. Discretionary Spending / Dining Spikes
    food_spend = next((c["total_spend"] for c in category_spends if c["category"] == "food"), 0.0)
    food_pct = (food_spend / total_expenses * 100) if total_expenses > 0 else 0.0
    if food_pct > 20.0 and food_spend > 15000:
        recs.append({
            "id": "rec_dining_spend",
            "title": "Optimize Food Delivery & Dining Out",
            "category": "Discretionary Spending",
            "priority": "MEDIUM",
            "impact": f"Potential savings of ₹{food_spend * 0.25:,.0f}/quarter",
            "description": f"Food delivery and restaurant spend represents {food_pct:.1f}% of your total outflows (₹{food_spend:,.0f}). Fast dining and food app orders can silently accumulate.",
            "actionable_step": "Set a weekly dining and delivery budget on UPI apps. Shifting 2 restaurant meals a week to home-cooked options can free up over ₹4,000 monthly."
        })

    # 4. Recurring Subscriptions Audit
    if subscriptions:
        total_sub_annual = sum(s["estimated_annual_cost"] for s in subscriptions)
        if total_sub_annual > 12000:
            recs.append({
                "id": "rec_subscriptions_audit",
                "title": f"Review {len(subscriptions)} Active Subscriptions",
                "category": "Subscriptions",
                "priority": "MEDIUM",
                "impact": f"Reclaim up to ₹{total_sub_annual * 0.35:,.0f}/year",
                "description": f"You have {len(subscriptions)} recurring standing charges totaling an estimated ₹{total_sub_annual:,.0f} per year. Check for overlapping streaming, cloud, or app memberships.",
                "actionable_step": "Audit your active digital subscriptions (e.g. Netflix, Prime, gym, cloud storage). Cancel any service not accessed in the last 30 days."
            })

    # 5. UPI Micro-Transaction Leakage
    upi_spend = next((c["total_spend"] for c in category_spends if c["category"] == "upi_transfers"), 0.0)
    upi_pct = (upi_spend / total_expenses * 100) if total_expenses > 0 else 0.0
    if upi_pct > 25.0:
        recs.append({
            "id": "rec_upi_tracking",
            "title": "Monitor Uncategorized UPI Transfers",
            "category": "Cash Flow Tracking",
            "priority": "LOW",
            "impact": "Improve Spending Visibility",
            "description": f"UPI peer transfers and QR payments account for {upi_pct:.1f}% of your total expenditure (₹{upi_spend:,.0f}). Frequent petty UPI transactions are the primary cause of unaccounted cash leakage.",
            "actionable_step": "Add specific remarks when making merchant QR payments (e.g. 'groceries', 'tea') or set a weekly UPI wallet balance cap to prevent impulse micro-purchases."
        })

    # 6. Low Balance Penalty Risk
    if low_bal_days > 0:
        recs.append({
            "id": "rec_low_balance",
            "title": "Prevent Minimum Balance Charges",
            "category": "Banking & Fees",
            "priority": "HIGH" if low_bal_days > 5 else "MEDIUM",
            "impact": "Avoid Penalty Surcharges & Missed Mandates",
            "description": f"Your account balance dipped below ₹5,000 on {low_bal_days} day(s) during this period. Near-zero balances increase the risk of auto-debit bounces and non-maintenance penalties.",
            "actionable_step": "Maintain a persistent baseline buffer of at least ₹15,000 in your primary operating account, or activate auto-sweep FD facilities."
        })

    # 7. High Savings Rate Acceleration
    if savings_rate >= 30.0:
        recs.append({
            "id": "rec_invest_surplus",
            "title": "Accelerate Wealth with Systematic SIPs",
            "category": "Investments",
            "priority": "LOW",
            "impact": "Long-Term Compound Growth",
            "description": f"You achieved an impressive {savings_rate:.1f}% savings rate! Excess cash sitting idle in a low-interest savings account loses value against inflation.",
            "actionable_step": "Automate systematic investment plans (SIPs) into broad market index mutual funds or diversified assets on the day your salary is credited."
        })

    # Default recommendation if none triggered
    if not recs:
        recs.append({
            "id": "rec_baseline_budget",
            "title": "Adopt the 50/30/20 Budgeting Rule",
            "category": "Budgeting",
            "priority": "MEDIUM",
            "impact": "Balanced Wealth Structure",
            "description": "Structure your income: 50% for core needs (rent, groceries, utilities), 30% for lifestyle wants, and at least 20% dedicated to savings and investments.",
            "actionable_step": "Review monthly category totals against this 50/30/20 guideline and rebalance discretionary categories."
        })

    return recs
