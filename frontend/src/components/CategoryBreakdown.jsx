import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const LUXURY_PALETTE = [
  '#f59e0b', // Gold / Amber
  '#fbbf24', // Warm Champagne
  '#d97706', // Deep Gold
  '#b45309', // Bronze
  '#f97316', // Topaz
  '#ea580c', // Copper
  '#e11d48', // Ruby
  '#6366f1', // Sapphire
  '#8b5cf6', // Amethyst
  '#14b8a6', // Jade
  '#06b6d4', // Aquamarine
  '#64748b', // Slate
  '#94a3b8'  // Platinum
];

export default function CategoryBreakdown({ categories, currency = '₹' }) {
  if (!categories || categories.length === 0) return null;

  const chartData = categories.slice(0, 8).map((cat, i) => ({
    name: cat.label,
    value: cat.total_spend,
    color: LUXURY_PALETTE[i % LUXURY_PALETTE.length]
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="p-2.5 bg-[#161620] border border-amber-500/30 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-white mb-0.5">
            {data.name}
          </p>
          <p className="font-bold text-amber-400 font-mono">
            {formatCurrency(data.value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#121218]/95 border border-amber-500/20 shadow-xl shadow-black/40 flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <PieIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Category Breakdown
          </h3>
          <p className="text-xs text-slate-400">
            Distribution across expenditure portfolios
          </p>
        </div>
      </div>

      {/* Donut Chart */}
      <div className="h-52 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category List */}
      <div className="mt-4 space-y-2.5 max-h-60 overflow-y-auto pr-1">
        {categories.map((cat, idx) => {
          const color = LUXURY_PALETTE[idx % LUXURY_PALETTE.length];
          return (
            <div key={idx} className="text-xs">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="font-medium text-slate-200 truncate">
                    {cat.label}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ({cat.transaction_count} txns)
                  </span>
                </div>
                <div className="flex items-center space-x-2 shrink-0 font-mono">
                  <span className="font-bold text-white">
                    {formatCurrency(cat.total_spend, currency)}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-400/90 w-9 text-right">
                    {cat.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(100, Math.max(3, cat.percentage))}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
