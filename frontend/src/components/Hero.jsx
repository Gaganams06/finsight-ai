import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Zap, BarChart3, Lock, CheckCircle2 } from 'lucide-react';

export default function Hero({ onTrySample, onScrollToUpload }) {
  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      {/* Luxury Gold & Amber Glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[380px] bg-amber-500/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6">
        
        {/* Top Centurion pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#14141c] border border-amber-500/25 text-xs font-semibold text-amber-300 mb-6 shadow-md shadow-amber-950/40">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Zero-Retention Architecture • Pure In-Memory Analysis</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
          Turn Bank Statements into <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
            Financial Health Intelligence
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Upload any bank statement (PDF, CSV, Excel). Get an instant 0–100 Financial Health Score, automated transaction categorization, recurring subscription detection, and custom rule-based recommendations.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onScrollToUpload}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 hover:brightness-110 transition transform active:scale-95"
          >
            <span>Upload Statement</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
          <button
            onClick={onTrySample}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] text-amber-200 font-bold text-sm border border-amber-500/30 hover:border-amber-500/60 shadow-sm transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Try with Sample Data</span>
          </button>
        </div>

        {/* Key Feature checklist */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="flex items-center space-x-2 text-xs text-slate-300 p-2.5 rounded-xl bg-[#121218]/80 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">SBI, HDFC, ICICI & more</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300 p-2.5 rounded-xl bg-[#121218]/80 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">13-Category ML Engine</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300 p-2.5 rounded-xl bg-[#121218]/80 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">Isolation Forest Anomalies</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-slate-300 p-2.5 rounded-xl bg-[#121218]/80 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-medium">Zero Storage Policy</span>
          </div>
        </div>

      </div>
    </section>
  );
}
