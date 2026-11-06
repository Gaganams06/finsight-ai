import React from 'react';
import { UploadCloud, Cpu, PieChart } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload Bank Statement',
      desc: 'Drop in your PDF, CSV, or Excel statement (up to 10 MB). Handled purely in volatile memory without writing a single byte to disk or database.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Automated In-Memory Parsing',
      desc: 'Algorithms extract dates, narrations, debits, credits, and compute rolling balances. Categorizes 13 spending sectors using UPI heuristics and Scikit-Learn.',
      icon: Cpu,
    },
    {
      num: '03',
      title: 'Health Score & Insights',
      desc: 'Receive an objective 0–100 Financial Health Score, recurring subscription radar, anomaly detection alerts, and tailored rule-based savings tips.',
      icon: PieChart,
    }
  ];

  return (
    <section className="py-14 border-t border-slate-800/80 bg-[#0e0e13]/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Finsight AI Works
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            A three-step privacy-preserving pipeline converting raw transaction dumps into executive financial intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-7 rounded-3xl bg-[#121218] border border-slate-800/90 hover:border-amber-500/40 shadow-lg shadow-black/40 transition duration-200"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-amber-500/30 font-mono">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
