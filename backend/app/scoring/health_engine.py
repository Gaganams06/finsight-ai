from typing import List, Dict, Any, Tuple
import numpy as np

def calculate_financial_health_score(
    cashflow_summary: Dict[str, Any],
    monthly_trends: List[Dict[str, Any]],
    category_spends: List[Dict[str, Any]],
    balance_metrics: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Computes an objective, explainable Financial Health Score (0-100)
    across 5 core financial health dimensions.
    """
    total_income = cashflow_summary.get("total_income", 0.0)
    total_expenses = cashflow_summary.get("total_expenses", 0.0)
    savings_rate = cashflow_summary.get("savings_rate", 0.0)
    avg_burn = cashflow_summary.get("avg_monthly_burn", 0.0)
    adb = balance_metrics.get("average_daily_balance", 0.0)
    low_balance_days = balance_metrics.get("low_balance_days", 0)

    # 1. Savings Rate Factor (Weight: 25%)
    if savings_rate >= 35.0:
        sav_score = 100.0
        sav_status = "Excellent"
        sav_exp = f"Outstanding savings rate of {savings_rate:.1f}%, far exceeding the 20% benchmark."
    elif savings_rate >= 20.0:
        sav_score = 85.0 + (savings_rate - 20.0) * 1.0
        sav_status = "Good"
        sav_exp = f"Healthy savings rate of {savings_rate:.1f}%, sustaining positive net cash additions."
    elif savings_rate >= 10.0:
        sav_score = 65.0 + (savings_rate - 10.0) * 2.0
        sav_status = "Fair"
        sav_exp = f"Moderate savings rate of {savings_rate:.1f}%. Aim to reach 20% to build a long-term safety net."
    elif savings_rate >= 0.0:
        sav_score = 40.0 + savings_rate * 2.5
        sav_status = "Needs Attention"
        sav_exp = f"Thin savings cushion of {savings_rate:.1f}%. Little to no surplus after monthly commitments."
    else:
        sav_score = max(5.0, 30.0 + savings_rate * 0.5)
        sav_status = "Critical"
        sav_exp = f"Negative savings rate ({savings_rate:.1f}%). Outflows exceed total inflows."

    # 2. Expense-to-Income Ratio (Weight: 20%)
    exp_ratio = (total_expenses / total_income * 100) if total_income > 0 else 100.0
    if exp_ratio <= 50.0:
        exp_score = 100.0
        exp_status = "Excellent"
        exp_exp = f"Exceptional spending control: using only {exp_ratio:.1f}% of total earnings."
    elif exp_ratio <= 70.0:
        exp_score = 85.0 - (exp_ratio - 50.0) * 0.75
        exp_status = "Good"
        exp_exp = f"Balanced expenditure: consuming {exp_ratio:.1f}% of income within recommended ranges."
    elif exp_ratio <= 85.0:
        exp_score = 65.0 - (exp_ratio - 70.0) * 1.3
        exp_status = "Fair"
        exp_exp = f"Elevated living costs consuming {exp_ratio:.1f}% of earnings."
    else:
        exp_score = max(10.0, 40.0 - (exp_ratio - 85.0) * 1.5)
        exp_status = "Needs Attention"
        exp_exp = f"High spending pressure ({exp_ratio:.1f}% of income), leaves minimal room for unexpected costs."

    # 3. EMI / Debt Burden (Weight: 20%)
    emi_spend = 0.0
    for cs in category_spends:
        if cs.get("category") == "emi_loans":
            emi_spend = cs.get("total_spend", 0.0)
            break

    emi_ratio = (emi_spend / total_income * 100) if total_income > 0 else 0.0
    if emi_ratio == 0:
        emi_score = 100.0
        emi_status = "Excellent"
        emi_exp = "Zero active loan or EMI obligations detected. Clean debt profile."
    elif emi_ratio <= 20.0:
        emi_score = 90.0 - emi_ratio * 0.5
        emi_status = "Good"
        emi_exp = f"Comfortable debt service ratio of {emi_ratio:.1f}%, well below the 35% safety limit."
    elif emi_ratio <= 35.0:
        emi_score = 75.0 - (emi_ratio - 20.0) * 1.3
        emi_status = "Fair"
        emi_exp = f"EMI burden represents {emi_ratio:.1f}% of income. Manageable, but keep credit cards in check."
    elif emi_ratio <= 50.0:
        emi_score = 50.0 - (emi_ratio - 35.0) * 1.6
        emi_status = "Needs Attention"
        emi_exp = f"High debt burden ({emi_ratio:.1f}% of earnings). A significant portion of cash goes to repayments."
    else:
        emi_score = max(5.0, 25.0 - (emi_ratio - 50.0) * 0.4)
        emi_status = "Critical"
        emi_exp = f"Severe debt servicing strain: {emi_ratio:.1f}% of earnings allocated to EMIs/debt."

    # 4. Balance Stability & Buffer (Weight: 20%)
    buffer_ratio = (adb / avg_burn) if avg_burn > 0 else 2.0
    if low_balance_days == 0 and buffer_ratio >= 1.5:
        bal_score = 100.0
        bal_status = "Excellent"
        bal_exp = f"Stable account balance (ADB ₹{adb:,.0f}) with zero low-balance days and a strong liquidity buffer."
    elif low_balance_days <= 2 and buffer_ratio >= 1.0:
        bal_score = 80.0
        bal_status = "Good"
        bal_exp = f"Solid cash reserve with ADB of ₹{adb:,.0f}. Only {low_balance_days} minor dip(s) below ₹5,000."
    elif low_balance_days <= 5 or buffer_ratio >= 0.5:
        bal_score = 60.0
        bal_status = "Fair"
        bal_exp = f"Moderate liquidity buffer. Experienced {low_balance_days} days near minimum balance."
    else:
        bal_score = max(10.0, 45.0 - low_balance_days * 3.0)
        bal_status = "Needs Attention"
        bal_exp = f"Frequent low-balance occurrences ({low_balance_days} days below ₹5,000) indicating cashflow timing friction."

    # 5. Spending Consistency (Weight: 15%)
    if len(monthly_trends) >= 2:
        monthly_expenses = [m["expenses"] for m in monthly_trends]
        mean_exp = np.mean(monthly_expenses)
        std_exp = np.std(monthly_expenses)
        cv_exp = (std_exp / mean_exp) if mean_exp > 0 else 0.0

        if cv_exp <= 0.15:
            cons_score = 95.0
            cons_status = "Excellent"
            cons_exp = "Very predictable monthly spending with minimal variance."
        elif cv_exp <= 0.30:
            cons_score = 80.0
            cons_status = "Good"
            cons_exp = "Normal month-to-month variation across regular spending."
        elif cv_exp <= 0.50:
            cons_score = 60.0
            cons_status = "Fair"
            cons_exp = "Notable variance in monthly outflows. Some months show sharp expense spikes."
        else:
            cons_score = 40.0
            cons_status = "Needs Attention"
            cons_exp = "Volatile spending patterns with large swings between billing cycles."
    else:
        cons_score = 80.0
        cons_status = "Good"
        cons_exp = "Consistent spending observed across statement duration."

    # Weighted calculation
    weights = [0.25, 0.20, 0.20, 0.20, 0.15]
    scores = [sav_score, exp_score, emi_score, bal_score, cons_score]
    overall = int(round(sum(w * s for w, s in zip(weights, scores))))
    overall = max(0, min(100, overall))

    # Determine Tier
    if overall >= 80:
        tier = "Excellent"
        badge_color = "emerald"
        summary = (
            f"Your financial health is in great shape with an overall score of {overall}/100. "
            f"You maintain a strong savings rate of {savings_rate:.1f}% and healthy cash buffers. "
            f"Continue disciplined investing to accelerate wealth creation."
        )
    elif overall >= 65:
        tier = "Good"
        badge_color = "blue"
        summary = (
            f"Your financial health is solid with a score of {overall}/100. "
            f"You live comfortably within your means, though optimizing discretionary spending and recurring "
            f"subscriptions could boost your savings rate further."
        )
    elif overall >= 50:
        tier = "Fair"
        badge_color = "amber"
        summary = (
            f"Your financial health is moderate ({overall}/100). "
            f"Elevated living expenses or EMI servicing are taking a significant bite out of your income. "
            f"Focus on building a 3-month emergency reserve and trimming non-essential recurring costs."
        )
    else:
        tier = "Needs Attention"
        badge_color = "rose"
        summary = (
            f"Your financial health requires immediate attention ({overall}/100). "
            f"Monthly outlays closely match or exceed total earnings, leaving the account vulnerable to cashflow shocks. "
            f"Review debt payments and curb high-discretionary expenses immediately."
        )

    factors = [
        {
            "name": "Savings Rate",
            "score": round(sav_score, 1),
            "weight": 0.25,
            "contribution": round(sav_score * 0.25, 1),
            "status": sav_status,
            "explanation": sav_exp
        },
        {
            "name": "Expense-to-Income Ratio",
            "score": round(exp_score, 1),
            "weight": 0.20,
            "contribution": round(exp_score * 0.20, 1),
            "status": exp_status,
            "explanation": exp_exp
        },
        {
            "name": "EMI / Debt Burden",
            "score": round(emi_score, 1),
            "weight": 0.20,
            "contribution": round(emi_score * 0.20, 1),
            "status": emi_status,
            "explanation": emi_exp
        },
        {
            "name": "Balance Stability & Buffer",
            "score": round(bal_score, 1),
            "weight": 0.20,
            "contribution": round(bal_score * 0.20, 1),
            "status": bal_status,
            "explanation": bal_exp
        },
        {
            "name": "Spending Consistency",
            "score": round(cons_score, 1),
            "weight": 0.15,
            "contribution": round(cons_score * 0.15, 1),
            "status": cons_status,
            "explanation": cons_exp
        }
    ]

    return {
        "overall_score": overall,
        "tier": tier,
        "badge_color": badge_color,
        "summary": summary,
        "factors": factors
    }
