from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
import numpy as np

LOW_BALANCE_THRESHOLD = 5000.0  # ₹5,000 standard Indian minimum balance buffer

def analyze_balances(transactions: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Computes daily balance trajectory, average daily balance (ADB),
    and counts low-balance threshold days.
    """
    if not transactions:
        return [], {"average_daily_balance": 0.0, "low_balance_days": 0, "stability_score": 100}

    # Group closing balances per day
    daily_map = {}
    for txn in transactions:
        d = txn["date"]
        bal = txn["balance"]
        if bal is not None:
            daily_map[d] = bal

    sorted_dates = sorted(daily_map.keys())
    if not sorted_dates:
        return [], {"average_daily_balance": 0.0, "low_balance_days": 0, "stability_score": 100}

    start_dt = datetime.strptime(sorted_dates[0], "%Y-%m-%d")
    end_dt = datetime.strptime(sorted_dates[-1], "%Y-%m-%d")

    # Generate continuous daily trajectory
    current_dt = start_dt
    last_balance = daily_map[sorted_dates[0]]
    daily_balances = []
    low_balance_days = 0
    all_balances = []

    while current_dt <= end_dt:
        date_str = current_dt.strftime("%Y-%m-%d")
        if date_str in daily_map:
            last_balance = daily_map[date_str]
        
        daily_balances.append({
            "date": date_str,
            "balance": round(last_balance, 2)
        })
        all_balances.append(last_balance)

        if last_balance < LOW_BALANCE_THRESHOLD:
            low_balance_days += 1

        current_dt += timedelta(days=1)

    arr = np.array(all_balances)
    adb = float(np.mean(arr)) if len(arr) > 0 else 0.0
    std_bal = float(np.std(arr)) if len(arr) > 0 else 0.0
    cv = (std_bal / adb) if adb > 0 else 1.0

    # Downsample points for UI if too many days (keep max ~90 points for snappy chart rendering)
    step = max(1, len(daily_balances) // 90)
    chart_points = daily_balances[::step]
    if daily_balances and chart_points[-1]["date"] != daily_balances[-1]["date"]:
        chart_points.append(daily_balances[-1])

    return chart_points, {
        "average_daily_balance": round(adb, 2),
        "low_balance_days": low_balance_days,
        "total_days": len(daily_balances),
        "min_balance": round(float(np.min(arr)), 2) if len(arr) > 0 else 0.0,
        "max_balance": round(float(np.max(arr)), 2) if len(arr) > 0 else 0.0,
        "volatility_cv": round(cv, 2)
    }
