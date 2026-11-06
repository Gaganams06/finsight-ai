import re
from typing import Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from .keywords import KEYWORD_RULES, CATEGORY_METADATA

# Synthetic corpus to seed the ML classifier fallback
ML_SEED_DATA = [
    # food
    ("dinner at pizzeria and drinks", "food"),
    ("coffee latte and snacks bakery", "food"),
    ("takeaway burger fries and shake", "food"),
    ("sushi bar and restaurant meal", "food"),
    ("fine dining hotel buffet lunch", "food"),
    ("tiffin center dosa idli breakfast", "food"),
    ("chinese noodle wok kitchen", "food"),
    ("ice cream parlor desserts gelato", "food"),
    # groceries
    ("fruits vegetables tomato potato market", "groceries"),
    ("organic supermarket weekly provisions", "groceries"),
    ("whole wheat flour rice pulses lentils", "groceries"),
    ("dairy products milk curd butter paneer", "groceries"),
    ("hypermarket household grocery shopping", "groceries"),
    # rent
    ("monthly house rent payment owner", "rent"),
    ("flat lease advance maintenance charges", "rent"),
    ("residential society apartment dues", "rent"),
    ("pg accommodation monthly fee", "rent"),
    # transport
    ("cab ride airport taxi fare", "transport"),
    ("metro train smartcard recharge", "transport"),
    ("petrol bunk fuel gas station", "transport"),
    ("highway toll plaza fastag transit", "transport"),
    ("airline flight ticket booking terminal", "transport"),
    # shopping
    ("apparel denim jeans shirt online store", "shopping"),
    ("running shoes sports sneakers footwear", "shopping"),
    ("home decor furniture curtains table", "shopping"),
    ("electronics gadget mobile laptop audio", "shopping"),
    # bills_utilities
    ("monthly electricity bill utility board", "bills_utilities"),
    ("cooking piped gas supply cylinder", "bills_utilities"),
    ("high speed fiber broadband wifi bill", "bills_utilities"),
    ("mobile cellular postpaid plan bill", "bills_utilities"),
    # emi_loans
    ("monthly home loan installment emi debit", "emi_loans"),
    ("auto loan finance principal repayment", "emi_loans"),
    ("credit card outstanding bill settlement", "emi_loans"),
    ("personal loan ecs standing instruction", "emi_loans"),
    # entertainment
    ("video streaming subscription monthly plan", "entertainment"),
    ("cinema movie tickets popcorn theater", "entertainment"),
    ("music streaming audio podcast license", "entertainment"),
    ("video gaming pass digital purchase", "entertainment"),
    # health
    ("doctor consultation prescription medicines pharmacy", "health"),
    ("blood test pathology clinic diagnostic", "health"),
    ("dental checkup tooth extraction clinic", "health"),
    ("hospital inpatient treatment bills", "health"),
    # education
    ("semester college university tuition fees", "education"),
    ("certification online courses learning exam", "education"),
    ("coaching classes test preparation academy", "education"),
    # investments
    ("mutual fund monthly sip equity allocation", "investments"),
    ("stock broker trading account deposit", "investments"),
    ("retirement pension fund voluntary contribution", "investments"),
    ("government sovereign bond gold investment", "investments"),
    # salary_income
    ("corporate salary credit month payroll", "salary_income"),
    ("quarterly performance bonus incentive earnings", "salary_income"),
    ("interest credited savings bank deposit", "salary_income"),
    ("dividend payout equity stock holding", "salary_income"),
    # upi_transfers
    ("money transferred to family friend peer", "upi_transfers"),
    ("instant payment transfer account", "upi_transfers"),
]

class CategorizationEngine:
    def __init__(self):
        # Train ML fallback model
        texts, labels = zip(*ML_SEED_DATA)
        self.ml_pipeline = Pipeline([
            ("tfidf", TfidfVectorizer(ngram_range=(1, 2), stop_words="english")),
            ("clf", MultinomialNB(alpha=0.1))
        ])
        self.ml_pipeline.fit(texts, labels)

    def extract_clean_merchant(self, desc: str) -> str:
        """Extracts recognizable merchant or entity name from noisy bank narration."""
        clean = desc.strip()

        # UPI pattern: UPI/DR/1234567890/MERCHANT/vpa@bank/...
        # or UPI-MERCHANT-vpa@bank-remarks
        upi_match = re.search(r"UPI/(?:CR|DR)/\d+/([^/]+)", clean, re.IGNORECASE)
        if upi_match:
            cand = upi_match.group(1).strip()
            # If cand looks like merchant name
            if len(cand) > 2 and not cand.isdigit():
                return cand.title()

        upi_dash = re.search(r"UPI[-/](?:TRANSFER TO|SENT TO|REV-)?([A-Za-z0-9\s]+?)[-/]", clean, re.IGNORECASE)
        if upi_dash:
            cand = upi_dash.group(1).strip()
            if len(cand) > 2 and not cand.isdigit():
                return cand.title()

        # Check prominent brands
        brands = [
            "Swiggy", "Zomato", "Amazon", "Flipkart", "Netflix", "Spotify", "Uber", 
            "Ola", "Blinkit", "Zepto", "BigBasket", "Cred", "Zerodha", "Groww", 
            "Airtel", "Jio", "Apollo", "Tata 1mg", "BookMyShow", "Myntra", "Dmart",
            "Starbucks", "McDonalds", "Dominos", "KFC", "MakeMyTrip", "IRCTC"
        ]
        desc_lower = clean.lower()
        for b in brands:
            if b.lower() in desc_lower:
                return b

        # Strip prefixes like NEFT, RTGS, IMPS, POS, ACH, NACH
        cleaned = re.sub(r"^(?:NEFT|RTGS|IMPS|POS|ACH|NACH|E-COMM|ECOM|TRF|TRANSFER|BIL|CMS|INB)[\s/:-]+", "", clean, flags=re.IGNORECASE)
        # Take first 3-4 words
        words = [w for w in cleaned.split() if len(w) > 1 and not w.isdigit() and not re.match(r"^\d+[/.-]\d+", w)]
        if words:
            return " ".join(words[:3]).title()

        return "Miscellaneous"

    def categorize_transaction(self, desc: str, debit: float, credit: float) -> Tuple[str, Optional[str]]:
        """
        Categorizes transaction using high-accuracy rule engine with ML fallback.
        Returns: (category, clean_merchant_name)
        """
        merchant = self.extract_clean_merchant(desc)
        desc_lower = desc.lower()

        # Rule 1: High-confidence income rules
        if credit > 0 and debit == 0:
            for kw in KEYWORD_RULES["salary_income"]:
                if kw in desc_lower:
                    return "salary_income", merchant

        # Rule 2: Keyword matching in priority order
        # High specificity first
        priority_categories = [
            "emi_loans", "investments", "food", "groceries", "entertainment", 
            "health", "transport", "shopping", "bills_utilities", "education", 
            "rent"
        ]

        for cat in priority_categories:
            for kw in KEYWORD_RULES[cat]:
                if kw in desc_lower:
                    return cat, merchant

        # Rule 3: UPI / Peer transfers check
        if any(kw in desc_lower for kw in KEYWORD_RULES["upi_transfers"]):
            return "upi_transfers", merchant

        # Rule 4: If credit, and no category matched yet, check if other income
        if credit > 0 and debit == 0:
            return "salary_income", merchant

        # Rule 5: ML Fallback
        # Clean text for ML
        text_for_ml = re.sub(r"[^a-zA-Z\s]", " ", desc_lower)
        text_for_ml = re.sub(r"\s+", " ", text_for_ml).strip()

        if len(text_for_ml) >= 4:
            try:
                pred = self.ml_pipeline.predict([text_for_ml])[0]
                proba = max(self.ml_pipeline.predict_proba([text_for_ml])[0])
                if proba >= 0.25 and pred in CATEGORY_METADATA and pred != "salary_income":
                    return pred, merchant
            except Exception:
                pass

        return "other", merchant

categorizer = CategorizationEngine()
