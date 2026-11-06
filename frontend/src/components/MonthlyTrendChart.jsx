import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function MonthlyTrendChart({ monthlyTrends, currency = '₹' }) {
  if (!monthlyTrends || monthlyTrends.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-[#161620] border border-amber-500/30 rounded-2xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">
            {label}
          </p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <span className="flex items-center space-x-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                <span>{entry.name}:</span>
              </span>
              <span className="font-semibold text-white font-mono">
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#121218]/95 border border-amber-500/20 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Monthly Cashflow & Savings Rate
            </h3>
            <p className="text-xs text-slate-400">
              Income inflows vs total expenditures and net savings trajectory
            </p>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(val) => {
                if (val >= 100000) return `${currency}${(val / 100000).toFixed(1)}L`;
                if (val >= 1000) return `${currency}${(val / 1000).toFixed(0)}k`;
                return `${currency}${val}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '12px', fontSize: '12px' }}
              iconType="circle"
            />
            <Bar dataKey="income" name="Income" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={38} />
            <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={38} />
            <Line
              type="monotone"
              dataKey="savings"
              name="Net Savings"
              stroke="#fde047"
              strokeWidth={3}
              dot={{ r: 4, fill: '#fde047' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
