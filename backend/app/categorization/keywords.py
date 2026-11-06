CATEGORY_METADATA = {
    "salary_income": {"label": "Salary & Income", "color": "#f59e0b", "is_income": True},
    "food": {"label": "Dining & Food", "color": "#fbbf24", "is_income": False},
    "groceries": {"label": "Groceries", "color": "#d97706", "is_income": False},
    "rent": {"label": "Rent & Housing", "color": "#b45309", "is_income": False},
    "transport": {"label": "Fuel & Commute", "color": "#f97316", "is_income": False},
    "shopping": {"label": "Shopping & Retail", "color": "#ea580c", "is_income": False},
    "bills_utilities": {"label": "Bills & Utilities", "color": "#d4af37", "is_income": False},
    "emi_loans": {"label": "EMI & Loan Repayments", "color": "#e11d48", "is_income": False},
    "upi_transfers": {"label": "UPI & Peer Transfers", "color": "#eab308", "is_income": False},
    "entertainment": {"label": "Entertainment & Subscriptions", "color": "#ca8a04", "is_income": False},
    "health": {"label": "Healthcare & Medical", "color": "#a16207", "is_income": False},
    "education": {"label": "Education & Learning", "color": "#854d0e", "is_income": False},
    "investments": {"label": "Investments & Savings", "color": "#facc15", "is_income": False},
    "other": {"label": "Other & Miscellaneous", "color": "#64748b", "is_income": False}
}

KEYWORD_RULES = {
    "salary_income": [
        "salary", "sal cr", "payroll", "stipend", "wages", "bonus", "dividend", 
        "interest credit", "int.pd", "int paid", "credited by employer", "annual bonus", 
        "consulting fee", "freelance", "reimbursement", "cashback", "refund"
    ],
    "food": [
        "swiggy", "zomato", "mcdonalds", "kfc", "dominos", "pizza hut", "starbucks", 
        "cafe coffee day", "ccd", "burger king", "subway", "barbeque nation", "haldiram", 
        "bikanervala", "restaurant", "cafe", "bakery", "dhaba", "biryani", "eats", 
        "dining", "food court", "chai point", "chaayos", "faasos", "behrouz"
    ],
    "groceries": [
        "blinkit", "zepto", "instamart", "bigbasket", "bb daily", "dmart", "spencers", 
        "nature basket", "more retail", "supermarket", "grocery", "provision", "kirana", 
        "fresh vegetables", "fruits", "dairy", "milk", "amul", "mother dairy", "country delight"
    ],
    "rent": [
        "rent", "house rent", "maintenance", "society", "landlord", "nobroker", 
        "mygate", "nestaway", "flat rent", "pg rent", "apartment"
    ],
    "transport": [
        "uber", "ola", "rapido", "irctc", "railways", "indigo", "air india", "vistara", 
        "akasa", "spicejet", "makemytrip", "easemytrip", "cleartrip", "redbus", "abhibus", 
        "fastag", "toll", "metro", "fuel", "petrol", "diesel", "hpcl", "bpcl", "iocl", 
        "shell petrol", "cng", "auto rickshaw", "parking", "flight", "train"
    ],
    "shopping": [
        "amazon", "flipkart", "myntra", "ajio", "meesho", "nykaa", "tata cliq", 
        "zara", "h&m", "uniqlo", "westside", "pantaloons", "max fashion", "lifestyle", 
        "croma", "reliance digital", "vijay sales", "ikea", "decathlon", "lenskart", 
        "electronics", "mall", "clothing", "footwear", "apparel"
    ],
    "bills_utilities": [
        "electricity", "power", "bescom", "tneb", "mseb", "cesc", "bses", "torrent power", 
        "water bill", "bwssb", "gas bill", "indane", "bharat gas", "hp gas", "mahanagar gas", 
        "broadband", "wifi", "act fibernet", "airtel broadband", "jio fiber", "tataplay", 
        "tata sky", "dth", "dish tv", "recharge", "airtel pre", "airtel post", "jio prepaid", 
        "vi postpaid", "billdesk", "bbps", "municipal"
    ],
    "emi_loans": [
        "loan", "emi", "bajaj finance", "hdbfs", "tata capital", "idfc first loan", 
        "sbi home loan", "hdfc bank loan", "icici home loan", "car loan", "personal loan", 
        "cred", "credit card", "cc payment", "card payment", "nach", "ecs", "auto debit loan", 
        "slice", "onecard", "uni card", "stashfin", "kreditbee", "earlysalary", "fibe"
    ],
    "entertainment": [
        "netflix", "spotify", "hotstar", "disney", "prime video", "amazon prime", "youtube", 
        "bookmyshow", "pvr", "inox", "cinepolis", "playstation", "sony liv", "zee5", 
        "apple.com/bill", "itunes", "google storage", "audible", "steam", "nintendo"
    ],
    "health": [
        "apollo", "pharmeasy", "1mg", "tata 1mg", "medplus", "netmeds", "practo", 
        "hospital", "pharmacy", "chemist", "dr.", "doctor", "clinic", "diagnostic", 
        "lal pathlabs", "metropolis", "dentist", "dental", "opticals", "max healthcare", 
        "fortis", "manipal"
    ],
    "education": [
        "school", "college", "university", "fees", "tuition", "coaching", "allen", 
        "aakash", "fiitjee", "coursera", "udemy", "edx", "upgrad", "simplilearn", 
        "unacademy", "byjus", "books", "stationery"
    ],
    "investments": [
        "zerodha", "groww", "angelone", "angel broking", "upstox", "kuvera", "coin", 
        "mutual fund", "sip", "camsonline", "kfintech", "uti mf", "hdfc mutual", 
        "sbi mutual", "icici prudential", "ppf", "nps", "fd", "fixed deposit", 
        "recurring deposit", "rd", "sovereign gold", "stocks", "equity", "sharekhan"
    ],
    "upi_transfers": [
        "upi/", "upi-", "upi", "imps", "neft", "rtgs", "fund transfer", "trans to", 
        "transfer to", "sent to", "received from", "p2p", "p2a", "vpa", "@okaxis", 
        "@okhdfcbank", "@oksbi", "@okicici", "@paytm", "@ybl", "@ibl", "@apl"
    ]
}
