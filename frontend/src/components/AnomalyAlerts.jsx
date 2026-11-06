import React from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function AnomalyAlerts({ anomalies, currency = '₹' }) {
  if (!anomalies || anomalies.length === 0) return null;

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#121218]/95 border border-amber-500/20 shadow-xl shadow-black/40">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Anomalous Spending Alerts
            </h3>
            <p className="text-xs text-slate-400">
              Transactions flagged by Isolation Forest & statistical spike detection
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
          {anomalies.length} Flagged
        </span>
      </div>

      <div className="space-y-3">
        {anomalies.map((anom) => {
          const isHigh = anom.severity === 'HIGH';
          return (
            <div
              key={anom.id}
              className={`p-4 rounded-2xl border transition ${
                isHigh
                  ? 'bg-rose-950/20 border-rose-900/50'
                  : 'bg-amber-950/20 border-amber-900/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-start space-x-3">
                  <span
                    className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full mt-0.5 ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {anom.severity} Anomaly
                  </span>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-white">
                      {anom.description}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {formatDate(anom.date)} • Category: <span className="font-semibold text-amber-300 capitalize">{anom.category.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-sm sm:text-base font-black text-white font-mono">
                    {formatCurrency(anom.amount, currency)}
                  </p>
                </div>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800 text-xs text-slate-300 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{anom.reason}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
