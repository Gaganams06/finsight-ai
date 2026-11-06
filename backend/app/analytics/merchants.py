from typing import List, Dict, Any, Tuple
from collections import defaultdict
from datetime import datetime

def analyze_merchants_and_subscriptions(transactions: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]]]:
    """
    Identifies top merchants by spend volume and recurring subscriptions / scheduled payments.
    """
    merchant_spend = defaultdict(lambda: {"total": 0.0, "count": 0, "category": "other"})
    merchant_occurrences = defaultdict(list)

    for txn in transactions:
        debit = txn["debit"]
        if debit <= 0:
            continue

        merchant = txn.get("merchant") or "Miscellaneous"
        cat = txn.get("category") or "other"

        # Exclude generic salary or internal account transfers from top merchant rankings
        if cat != "salary_income":
            merchant_spend[merchant]["total"] += debit
            merchant_spend[merchant]["count"] += 1
            merchant_spend[merchant]["category"] = cat

            merchant_occurrences[merchant].append({
                "date": txn["date"],
                "amount": debit,
                "category": cat
            })

    # Sort top merchants
    sorted_merchants = sorted(
        merchant_spend.items(),
        key=lambda x: x[1]["total"],
        reverse=True
    )

    top_merchants = [
        {
            "merchant": m,
            "total_spend": round(info["total"], 2),
            "count": info["count"],
            "category": info["category"]
        }
        for m, info in sorted_merchants[:10]
    ]

    # Detect Recurring Subscriptions / Standing Payments
    subscriptions = []
    sub_id = 0

    for merchant, occurrences in merchant_occurrences.items():
        if len(occurrences) < 2:
            continue

        # Sort occurrences by date
        sorted_occ = sorted(occurrences, key=lambda x: x["date"])
        
        # Check amount consistency (max - min < 15% of avg or within ₹50)
        amounts = [o["amount"] for o in sorted_occ]
        avg_amt = sum(amounts) / len(amounts)
        amt_diff = max(amounts) - min(amounts)
        
        is_amount_consistent = (amt_diff / avg_amt < 0.15) if avg_amt > 0 else False
        if not is_amount_consistent and amt_diff > 50:
            continue

        # Check cadence in days
        dates = [datetime.strptime(o["date"], "%Y-%m-%d") for o in sorted_occ]
        intervals = [(dates[i] - dates[i-1]).days for i in range(1, len(dates))]
        if not intervals:
            continue

        avg_interval = sum(intervals) / len(intervals)

        # Detect cadence
        cadence = None
        annual_mult = 12
        if 24 <= avg_interval <= 38:
            cadence = "Monthly"
            annual_mult = 12
        elif 6 <= avg_interval <= 10:
            cadence = "Weekly"
            annual_mult = 52
        elif 12 <= avg_interval <= 18:
            cadence = "Bi-weekly"
            annual_mult = 26
        elif 80 <= avg_interval <= 105:
            cadence = "Quarterly"
            annual_mult = 4

        # Common subscription brands get detected even if only 2 occurrences present
        known_sub_brands = {
            "netflix", "spotify", "hotstar", "amazon prime", "prime video", "apple", 
            "google", "youtube", "airtel", "jio", "act fibernet", "broadband", 
            "gym", "cult", "rent", "emi"
        }
        is_known_sub = any(b in merchant.lower() for b in known_sub_brands)

        if cadence or (is_known_sub and is_amount_consistent):
            sub_id += 1
            effective_cadence = cadence or "Monthly"
            effective_annual_mult = annual_mult if cadence else 12
            cat = sorted_occ[-1]["category"]

            subscriptions.append({
                "id": f"sub_{sub_id}",
                "name": merchant,
                "amount": round(avg_amt, 2),
                "frequency": effective_cadence,
                "last_date": sorted_occ[-1]["date"],
                "estimated_annual_cost": round(avg_amt * effective_annual_mult, 2),
                "category": cat
            })

    # Sort subscriptions by estimated annual cost descending
    subscriptions.sort(key=lambda x: x["estimated_annual_cost"], reverse=True)

    return top_merchants, subscriptions
