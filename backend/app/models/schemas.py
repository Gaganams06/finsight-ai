from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Transaction(BaseModel):
    id: str
    date: str  # YYYY-MM-DD
    description: str
    debit: float = 0.0
    credit: float = 0.0
    balance: Optional[float] = None
    category: str = "other"
    is_anomaly: bool = False
    anomaly_score: Optional[float] = None
    merchant: Optional[str] = None
    account_mask: Optional[str] = None

class MonthlyMetric(BaseModel):
    month: str  # YYYY-MM or Mon YYYY
    income: float = 0.0
    expenses: float = 0.0
    savings: float = 0.0
    savings_rate: float = 0.0  # percentage 0-100
    net_cashflow: float = 0.0

class CategorySpend(BaseModel):
    category: str
    label: str
    total_spend: float = 0.0
    percentage: float = 0.0
    transaction_count: int = 0
    color: Optional[str] = None

class MerchantSpend(BaseModel):
    merchant: str
    total_spend: float = 0.0
    count: int = 0
    category: str = "other"

class Subscription(BaseModel):
    id: str
    name: str
    amount: float
    frequency: str  # Monthly, Bi-weekly, Weekly
    last_date: str
    estimated_annual_cost: float
    category: str

class AnomalyItem(BaseModel):
    id: str
    date: str
    description: str
    amount: float
    category: str
    reason: str
    severity: str  # HIGH, MEDIUM, LOW

class HealthScoreFactor(BaseModel):
    name: str
    score: float  # 0 to 100
    weight: float  # e.g. 0.25
    contribution: float  # score * weight
    status: str  # Excellent, Good, Fair, Poor
    explanation: str

class HealthScore(BaseModel):
    overall_score: int
    tier: str  # Excellent, Good, Fair, Needs Attention
    badge_color: str
    summary: str
    factors: List[HealthScoreFactor]

class Recommendation(BaseModel):
    id: str
    title: str
    description: str
    category: str
    priority: str  # HIGH, MEDIUM, LOW
    impact: str
    actionable_step: str

class BalanceTrendPoint(BaseModel):
    date: str
    balance: float

class SummaryMetrics(BaseModel):
    total_income: float
    total_expenses: float
    net_savings: float
    savings_rate: float
    average_daily_balance: float
    low_balance_days: int
    total_transactions: int
    avg_monthly_burn: float
    estimated_runway_months: float

class AccountMeta(BaseModel):
    account_mask: str
    bank_detected: str
    start_date: str
    end_date: str
    duration_months: int
    currency: str = "₹"
    filename: Optional[str] = None

class AnalysisResponse(BaseModel):
    success: bool = True
    meta: AccountMeta
    summary: SummaryMetrics
    health_score: HealthScore
    monthly_trends: List[MonthlyMetric]
    category_breakdown: List[CategorySpend]
    top_merchants: List[MerchantSpend]
    recurring_subscriptions: List[Subscription]
    anomalies: List[AnomalyItem]
    daily_balances: List[BalanceTrendPoint]
    recommendations: List[Recommendation]
    transactions: List[Transaction]
    privacy_notice: str = "Statement processed strictly in-memory. Zero database retention."
