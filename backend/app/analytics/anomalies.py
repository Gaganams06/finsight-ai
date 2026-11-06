import numpy as np
from typing import List, Dict, Any
from collections import defaultdict
from sklearn.ensemble import IsolationForest

def detect_anomalies(transactions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Detects anomalous financial transactions using Isolation Forest & statistical z-score.
    Returns structured anomaly items with severity, reason, and context.
    """
    debit_txns = [t for t in transactions if t["debit"] > 0 and t["category"] not in ("investments", "emi_loans")]
    if len(debit_txns) < 5:
        return []

    # Category statistics
    cat_amounts = defaultdict(list)
    for t in debit_txns:
        cat_amounts[t["category"]].append(t["debit"])

    cat_stats = {}
    for cat, amts in cat_amounts.items():
        arr = np.array(amts)
        cat_stats[cat] = {
            "mean": float(np.mean(arr)),
            "std": float(np.std(arr)) if len(arr) > 1 else 0.0,
            "max": float(np.max(arr))
        }

    # Features for Isolation Forest: [amount, log_amount, day_of_month]
    features = []
    for t in debit_txns:
        amt = t["debit"]
        day = int(t["date"].split("-")[2])
        features.append([amt, np.log1p(amt), day])

    X = np.array(features)

    # Fit Isolation Forest
    contamination = min(0.06, max(0.02, 5 / len(debit_txns)))
    iso = IsolationForest(contamination=contamination, random_state=42)
    predictions = iso.fit_predict(X)
    scores = iso.decision_function(X)

    anomalies = []
    seen_ids = set()

    for idx, (txn, pred, score) in enumerate(zip(debit_txns, predictions, scores)):
        cat = txn["category"]
        amt = txn["debit"]
        stats = cat_stats.get(cat, {"mean": amt, "std": 0.0})
        mean = stats["mean"]
        std = stats["std"]

        # Check conditions:
        # 1. Isolation Forest flagged (-1) and amount is substantial (> 2000)
        # 2. Or statistical z-score > 2.8 and amt > 2.5 * mean
        is_iso_anomaly = (pred == -1) and amt >= 2000
        is_stat_anomaly = (std > 0 and (amt - mean) / std >= 2.8) and (amt >= 2.5 * mean) and amt >= 2000

        if is_iso_anomaly or is_stat_anomaly:
            if txn["id"] in seen_ids:
                continue
            seen_ids.add(txn["id"])

            ratio = round(amt / mean, 1) if mean > 0 else 1.0
            severity = "HIGH" if (ratio >= 4.0 or amt >= 25000) else "MEDIUM"

            if ratio >= 2.0:
                reason = f"Amount ₹{amt:,.2f} is {ratio}x higher than your average {cat.replace('_', ' ')} transaction (avg ₹{mean:,.2f})."
            else:
                reason = f"Unusual spending pattern detected by ML model based on transaction frequency and timing."

            anomalies.append({
                "id": f"anom_{len(anomalies) + 1}",
                "date": txn["date"],
                "description": txn["description"],
                "amount": amt,
                "category": cat,
                "reason": reason,
                "severity": severity
            })

    # Sort anomalies by amount descending
    anomalies.sort(key=lambda x: x["amount"], reverse=True)
    return anomalies[:10]
