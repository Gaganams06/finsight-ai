import React from 'react';
import { Lightbulb, CheckCircle2, Sparkles } from 'lucide-react';

export default function RecommendationsPanel({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#121218]/95 border border-amber-500/20 shadow-xl shadow-black/40">
      <div className="flex items-center space-x-3 pb-4 border-b border-slate-800 mb-6">
        <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white">
            Actionable Financial Recommendations
          </h3>
          <p className="text-xs text-slate-400">
            Rule-based suggestions tailored to your cashflow and spending profile
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isHigh = rec.priority === 'HIGH';
          const isMed = rec.priority === 'MEDIUM';

          return (
            <div
              key={rec.id}
              className="p-5 rounded-2xl bg-[#161620]/90 border border-slate-800/90 flex flex-col justify-between hover:border-amber-500/50 transition duration-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60">
                    {rec.category}
                  </span>

                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      isHigh
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : isMed
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1.5">
                  {rec.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rec.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="text-[11px] font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Impact: {rec.impact}</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0f0f14] border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{rec.actionable_step}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
