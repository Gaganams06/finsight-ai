import React from 'react';
import { X, Printer, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function ReportModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const { meta, summary, health_score, category_breakdown, recommendations } = data;
  const currency = meta?.currency || '₹';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-[#101016] text-white rounded-3xl shadow-2xl border border-amber-500/30 overflow-hidden my-8 ring-1 ring-amber-500/20">
        
        {/* Modal Top Actions (Hidden on Print) */}
        <div className="no-print p-4 border-b border-slate-800 flex items-center justify-between bg-[#0c0c10]">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400">
            <FileText className="w-4 h-4" />
            <span>Finsight AI Executive Financial Report (Centurion Edition)</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/20 hover:brightness-110 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-slate-800 hover:bg-[#1a1a24] text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div id="printable-report" className="p-6 sm:p-10">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-amber-500/30 gap-4">
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="text-2xl font-black tracking-tight text-white">
                  Finsight <span className="text-amber-400">AI</span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  CONFIDENTIAL EXECUTIVE REPORT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Private Wealth Analytics & Financial Health Audit
              </p>
            </div>

            <div className="text-left sm:text-right text-xs">
              <p className="font-bold text-amber-300">
                {meta?.bank_detected || 'Bank Statement'}
              </p>
              <p className="text-slate-400 font-mono mt-0.5">
                Account: {meta?.account_mask}
              </p>
              <p className="text-slate-500 text-[11px]">
                Period: {formatDate(meta?.start_date)} – {formatDate(meta?.end_date)}
              </p>
            </div>
          </div>

          {/* Health Score Summary Banner */}
          <div className="my-6 p-6 rounded-3xl bg-[#14141d] border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 text-slate-950 flex flex-col items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
                <span className="text-3xl leading-none font-mono">{health_score?.overall_score}</span>
                <span className="text-[9px] uppercase tracking-wider font-extrabold opacity-90">/ 100</span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  {health_score?.tier} Financial Standing
                </span>
                <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                  {health_score?.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Key Financial Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-[#14141c] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Inflow</span>
              <p className="text-base font-black text-amber-400 font-mono mt-0.5">
                {formatCurrency(summary?.total_income, currency)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#14141c] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Outflow</span>
              <p className="text-base font-black text-rose-400 font-mono mt-0.5">
                {formatCurrency(summary?.total_expenses, currency)}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#14141c] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Net Savings</span>
              <p className="text-base font-black text-white font-mono mt-0.5">
                {formatCurrency(summary?.net_savings, currency)} ({summary?.savings_rate}%)
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#14141c] border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Daily Balance</span>
              <p className="text-base font-black text-yellow-300 font-mono mt-0.5">
                {formatCurrency(summary?.average_daily_balance, currency)}
              </p>
            </div>
          </div>

          {/* Top Spending Categories */}
          <div className="mb-6">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Expense Distribution Portfolio
            </h5>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {category_breakdown?.slice(0, 6).map((c, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#14141c] border border-slate-800 text-xs flex justify-between">
                  <span className="font-semibold text-slate-300 truncate">{c.label}</span>
                  <span className="font-black text-white font-mono shrink-0 ml-2">{formatCurrency(c.total_spend, currency)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Recommendations */}
          <div className="mb-6">
            <h5 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              Strategic Recommendations
            </h5>
            <div className="space-y-2.5">
              {recommendations?.slice(0, 3).map((r, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-[#14141c] border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold mb-1">
                    <span className="text-white">{r.title}</span>
                    <span className="text-[10px] uppercase font-bold text-amber-400">{r.priority}</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">{r.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Report Footer */}
          <div className="pt-6 border-t border-slate-800 text-[10px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>Generated securely in-memory by Finsight AI • Zero Storage Policy</span>
            <span>Private wealth analytics • Not certified financial advice</span>
          </div>

        </div>

      </div>
    </div>
  );
}
