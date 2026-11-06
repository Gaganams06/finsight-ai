from datetime import datetime, timedelta
from typing import List, Dict, Any, Tuple
import random

def generate_sample_statement() -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Generates a realistic, multifaceted 6-month Indian banking statement (HDFC/SBI style).
    Includes predictable salary, rent, investments, EMIs, recurring subscriptions, 
    daily living expenses (Swiggy, Blinkit, Uber), and a couple of distinct anomalous purchases.
    """
    transactions = []
    
    # 6-month span: 180 days prior to today
    base_date = datetime(2024, 5, 1)
    current_balance = 82450.00
    account_mask = "•••• •••• 4129"
    txn_id_counter = 1000

    def add_txn(date_dt: datetime, desc: str, debit: float, credit: float, bal: float):
        nonlocal txn_id_counter
        txn_id_counter += 1
        return {
            "id": f"smp_{txn_id_counter}",
            "date": date_dt.strftime("%Y-%m-%d"),
            "description": desc,
            "debit": round(debit, 2),
            "credit": round(credit, 2),
            "balance": round(bal, 2),
            "account_mask": account_mask
        }

    # Month by month simulation (6 months)
    for m in range(6):
        month_start = base_date + timedelta(days=m * 30)
        
        # 1st of month: Salary credit
        current_balance += 98500.00
        transactions.append(add_txn(
            month_start, 
            "SALARY CREDIT - INFOSYS TECHNOLOGIES LTD / PAYROLL MAY24", 
            0.0, 98500.00, current_balance
        ))

        # 3rd of month: House Rent
        rent_date = month_start + timedelta(days=2)
        current_balance -= 24000.00
        transactions.append(add_txn(
            rent_date,
            "NEFT DR - K VENKATESH - HOUSE RENT MAY APARTMENT",
            24000.00, 0.0, current_balance
        ))

        # 5th of month: Mutual Fund SIP investment
        sip_date = month_start + timedelta(days=4)
        current_balance -= 15000.00
        transactions.append(add_txn(
            sip_date,
            "ACH DR - ZERODHA BROKING LTD / BSE MUTUAL FUND SIP",
            15000.00, 0.0, current_balance
        ))

        # 7th of month: Loan EMI
        emi_date = month_start + timedelta(days=6)
        current_balance -= 12450.00
        transactions.append(add_txn(
            emi_date,
            "NACH DR - HDFC BANK AUTO LOAN EMI DUES",
            12450.00, 0.0, current_balance
        ))

        # 9th of month: Utilities (Electricity & Fiber)
        util_date = month_start + timedelta(days=8)
        current_balance -= 1840.00
        transactions.append(add_txn(
            util_date,
            "UPI/DR/4189021489/BESCOM ELECTRICITY BILL/bescom@sbi",
            1840.00, 0.0, current_balance
        ))

        net_date = month_start + timedelta(days=9)
        current_balance -= 1061.00
        transactions.append(add_txn(
            net_date,
            "UPI/DR/4190823412/ACT FIBERNET BROADBAND BILL/act@icici",
            1061.00, 0.0, current_balance
        ))

        # 12th of month: Subscriptions (Netflix & Spotify)
        sub1_date = month_start + timedelta(days=11)
        current_balance -= 649.00
        transactions.append(add_txn(
            sub1_date,
            "POS DR NETFLIX ENTERTAINMENT SERVICES MUMBAI",
            649.00, 0.0, current_balance
        ))

        sub2_date = month_start + timedelta(days=12)
        current_balance -= 119.00
        transactions.append(add_txn(
            sub2_date,
            "E-COMM DR SPOTIFY INDIA RECURRING MUSIC",
            119.00, 0.0, current_balance
        ))

        # Interspersed weekly groceries (Blinkit, Zepto, BigBasket)
        for w in [3, 10, 17, 24]:
            groc_dt = month_start + timedelta(days=w)
            g_amt = round(random.uniform(950, 2400), 2)
            current_balance -= g_amt
            store = random.choice(["BLINKIT QUICK COMMERCE", "ZEPTO DELIVERY BANGALORE", "BIGBASKET PROVISIONS"])
            transactions.append(add_txn(
                groc_dt,
                f"UPI/DR/92840192/{store}/pay@{store.split()[0].lower()}",
                g_amt, 0.0, current_balance
            ))

        # Interspersed dining / food delivery (Swiggy, Zomato)
        for d in [4, 8, 14, 19, 23, 27]:
            food_dt = month_start + timedelta(days=d)
            f_amt = round(random.uniform(320, 1150), 2)
            current_balance -= f_amt
            app = random.choice(["SWIGGY ORDER", "ZOMATO RESTAURANTS", "MCDONALDS DELIVERY"])
            transactions.append(add_txn(
                food_dt,
                f"UPI/DR/30918239/{app}/pay@{app.split()[0].lower()}",
                f_amt, 0.0, current_balance
            ))

        # Commute / Transport
        for c in [6, 13, 20, 26]:
            cab_dt = month_start + timedelta(days=c)
            cab_amt = round(random.uniform(280, 850), 2)
            current_balance -= cab_amt
            transactions.append(add_txn(
                cab_dt,
                "UPI/DR/71928301/UBER INDIA SYSTEMS/uber@hdfcbank",
                cab_amt, 0.0, current_balance
            ))

        # Occasional shopping / medical
        if m in (1, 3, 5):
            shop_dt = month_start + timedelta(days=16)
            s_amt = round(random.uniform(1800, 4200), 2)
            current_balance -= s_amt
            transactions.append(add_txn(
                shop_dt,
                "ECOM DR AMAZON SELLER SERVICES RETAIL",
                s_amt, 0.0, current_balance
            ))

        # Monthly fuel
        fuel_dt = month_start + timedelta(days=22)
        current_balance -= 2800.00
        transactions.append(add_txn(
            fuel_dt,
            "POS DR HPCL AUTO FUELS INDIRANAGAR",
            2800.00, 0.0, current_balance
        ))

    # Add 2 realistic Anomalous transactions
    # Anomaly 1: Big electronics gadget purchase in month 2 (Apple Store / Croma)
    anom1_dt = base_date + timedelta(days=48)
    current_balance -= 44900.00
    transactions.append(add_txn(
        anom1_dt,
        "POS DR APPLE IMAGINE STORE / CROMA ELECTRONICS BANGALORE",
        44900.00, 0.0, current_balance
    ))

    # Anomaly 2: Dental surgery or emergency medical in month 4
    anom2_dt = base_date + timedelta(days=115)
    current_balance -= 19500.00
    transactions.append(add_txn(
        anom2_dt,
        "POS DR MANIPAL HOSPITAL INPATIENT CLINICAL CARE",
        19500.00, 0.0, current_balance
    ))

    # Sort all transactions chronologically
    transactions.sort(key=lambda x: x["date"])

    # Recalculate true rolling balance from start
    running_bal = 82450.00
    for txn in transactions:
        running_bal = running_bal + txn["credit"] - txn["debit"]
        txn["balance"] = round(running_bal, 2)

    meta = {
        "bank": "HDFC Bank (Classic Priority)",
        "account_mask": account_mask
    }

    return transactions, meta
