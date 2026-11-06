import React from 'react';
import { TrendingUp, TrendingDown, PiggyBank, Landmark, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function SummaryCards({ summary, currency = '₹' }) {
  if (!summary) return null;

  const {
    total_income,
    total_expenses,
    net_savings,
    savings_rate,
    average_daily_balance,
    low_balance_days,
    avg_monthly_burn,
    estimated_runway_months
  } = summary;

  const cards = [
    {
      title: 'Total Inflow / Income',
      value: formatCurrency(total_income, currency),
      subtext: 'Cumulative deposits & earnings',
      icon: TrendingUp,
      badge: 'Inflow',
      badgeClass: 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
    },
    {
      title: 'Total Outflow / Spend',
      value: formatCurrency(total_expenses, currency),
      subtext: `Avg burn: ${formatCurrency(avg_monthly_burn, currency)}/mo`,
      icon: TrendingDown,
      badge: 'Outflow',
      badgeClass: 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
    },
    {
      title: 'Net Savings',
      value: formatCurrency(net_savings, currency),
      subtext: `${savings_rate >= 0 ? '+' : ''}${savings_rate}% savings rate`,
      icon: PiggyBank,
      badge: `${savings_rate}% Rate`,
      badgeClass: net_savings >= 0 ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
    },
    {
      title: 'Avg Daily Balance (ADB)',
      value: formatCurrency(average_daily_balance, currency),
      subtext: low_balance_days > 0 ? `${low_balance_days} dip(s) below ${currency}5,000` : 'Zero low-balance dips',
      icon: Landmark,
      badge: low_balance_days > 0 ? 'Alert' : 'Stable',
      badgeClass: low_balance_days > 0 ? 'bg-orange-500/10 text-orange-300 border border-orange-500/30' : 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/30'
    },
    {
      title: 'Estimated Runway',
      value: `${estimated_runway_months.toFixed(1)} Months`,
      subtext: `At ${formatCurrency(avg_monthly_burn, currency)} monthly rate`,
      icon: Clock,
      badge: estimated_runway_months >= 3 ? 'Healthy' : 'Low Buffer',
      badgeClass: estimated_runway_months >= 3 ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30' : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="p-5 rounded-3xl bg-[#121218]/95 border border-amber-500/15 hover:border-amber-500/40 shadow-lg shadow-black/40 flex flex-col justify-between transition"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">
                  {c.title}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${c.badgeClass}`}>
                  {c.badge}
                </span>
              </div>
              <div className="text-2xl font-black text-white tracking-tight font-mono">
                {c.value}
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="truncate">{c.subtext}</span>
              <Icon className="w-4 h-4 shrink-0 text-amber-400/80 ml-2" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
