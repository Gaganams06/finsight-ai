import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { Landmark, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function BalanceTimelineChart({ dailyBalances, adb, lowBalanceDays, currency = '₹' }) {
  if (!dailyBalances || dailyBalances.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const point = payload[0];
      return (
        <div className="p-2.5 bg-[#161620] border border-amber-500/30 rounded-xl shadow-xl text-xs">
          <p className="font-semibold text-slate-400 mb-0.5">
            {formatDate(label)}
          </p>
          <p className="font-bold text-sm text-amber-400 font-mono">
            {formatCurrency(point.value, currency)}
          </p>
          {point.value < 5000 && (
            <p className="text-[10px] text-rose-400 font-bold mt-1">
              Low Balance Dip (&lt;{currency}5,000)
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#121218]/95 border border-amber-500/20 shadow-xl shadow-black/40">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Daily Balance Trajectory & ADB
            </h3>
            <p className="text-xs text-slate-400">
              Average Daily Balance: <span className="font-bold text-amber-300 font-mono">{formatCurrency(adb, currency)}</span>
            </p>
          </div>
        </div>

        {lowBalanceDays > 0 ? (
          <div className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{lowBalanceDays} Low-Balance Day{lowBalanceDays > 1 ? 's' : ''} (&lt;{currency}5k)</span>
          </div>
        ) : (
          <div className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
            Resilient Minimum Balance
          </div>
        )}
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyBalances} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="goldBalanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(d) => {
                const parts = d.split('-');
                return parts.length === 3 ? `${parts[2]}/${parts[1]}` : d;
              }}
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
            {adb > 0 && (
              <ReferenceLine
                y={adb}
                stroke="#d4af37"
                strokeDasharray="4 4"
                label={{ value: 'ADB Target', position: 'insideTopRight', fill: '#d4af37', fontSize: 11, fontWeight: 'bold' }}
              />
            )}
            <ReferenceLine
              y={5000}
              stroke="#f43f5e"
              strokeDasharray="3 3"
              label={{ value: 'Min Threshold', position: 'insideBottomRight', fill: '#f43f5e', fontSize: 10 }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#f59e0b"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#goldBalanceGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
