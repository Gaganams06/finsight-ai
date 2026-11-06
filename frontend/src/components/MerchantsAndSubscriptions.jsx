import React, { useState } from 'react';
import { Store, Repeat, Calendar, DollarSign, ArrowUpRight } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function MerchantsAndSubscriptions({ merchants, subscriptions, currency = '₹' }) {
  const [activeTab, setActiveTab] = useState('subscriptions');

  const totalAnnualSubCost = subscriptions ? subscriptions.reduce((acc, s) => acc + s.estimated_annual_cost, 0) : 0;

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#121218]/95 border border-amber-500/20 shadow-xl shadow-black/40">
      
      {/* Header with Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-bold text-white">
            Merchants & Recurring Charges
          </h3>
          <p className="text-xs text-slate-400">
            Detected recurring subscriptions & top spending destinations
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-[#161620] border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'subscriptions'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Subscriptions ({subscriptions?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('merchants')}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              activeTab === 'merchants'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Top Merchants ({merchants?.length || 0})
          </button>
        </div>
      </div>

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <div className="pt-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-4 text-xs">
            <span className="text-amber-300 font-semibold">
              Estimated Total Annual Commitments:
            </span>
            <span className="font-black text-amber-400 text-sm font-mono">
              {formatCurrency(totalAnnualSubCost, currency)}/year
            </span>
          </div>

          {subscriptions && subscriptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-[#161620]/90 border border-slate-800 flex flex-col justify-between hover:border-amber-500/40 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-sm text-white">
                        {sub.name}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Last paid: {formatDate(sub.last_date)}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {sub.frequency}
                    </span>
                  </div>

                  <div className="mt-3.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="font-black text-white font-mono">
                      {formatCurrency(sub.amount, currency)} <span className="font-normal text-[10px] text-slate-500">/cycle</span>
                    </span>
                    <span className="text-[11px] text-amber-400 font-semibold font-mono">
                      ~{formatCurrency(sub.estimated_annual_cost, currency)}/yr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No regular repeating subscriptions identified.
            </div>
          )}
        </div>
      )}

      {/* Top Merchants Tab */}
      {activeTab === 'merchants' && (
        <div className="pt-4 space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {merchants && merchants.length > 0 ? (
            merchants.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#161620]/90 border border-slate-800 text-xs"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold flex items-center justify-center shrink-0 font-mono">
                    #{i + 1}
                  </div>
                  <div className="truncate">
                    <p className="font-bold text-white truncate">
                      {m.merchant}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {m.count} transaction{m.count > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-black text-white font-mono">
                    {formatCurrency(m.total_spend, currency)}
                  </p>
                  <span className="text-[10px] uppercase font-bold text-amber-400/80">
                    {m.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              No merchant data found.
            </div>
          )}
        </div>
      )}

    </div>
  );
}
