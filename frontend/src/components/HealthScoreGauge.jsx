import React from 'react';
import { Activity, ShieldCheck, TrendingUp, AlertCircle, Info, Award } from 'lucide-react';

export default function HealthScoreGauge({ healthScore }) {
  if (!healthScore) return null;

  const { overall_score, tier, summary, factors } = healthScore;

  // Circular gauge calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * 0.75;
  const strokeOffset = arcLength - (arcLength * Math.min(100, Math.max(0, overall_score))) / 100;

  const getTierColors = (t) => {
    switch (t) {
      case 'Excellent':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/40',
          stroke: '#f59e0b',
        };
      case 'Good':
        return {
          text: 'text-yellow-400',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/40',
          stroke: '#eab308',
        };
      case 'Fair':
        return {
          text: 'text-orange-400',
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/40',
          stroke: '#f97316',
        };
      default:
        return {
          text: 'text-rose-400',
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/40',
          stroke: '#f43f5e',
        };
    }
  };

  const colors = getTierColors(tier);

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#121218]/95 border border-amber-500/20 shadow-2xl shadow-black/50">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Financial Health Score
            </h3>
            <p className="text-xs text-slate-400">
              Evaluated across 5 institutional resilience dimensions
            </p>
          </div>
        </div>

        <div className={`px-3.5 py-1 rounded-full text-xs font-bold border ${colors.bg} ${colors.text} ${colors.border} shadow-sm`}>
          {tier} Standing
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
        
        {/* Left: Gauge & Score */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
              <defs>
                <linearGradient id="goldGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              {/* Background Arc */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="14"
                fill="none"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeLinecap="round"
              />
              {/* Animated Gold Progress Arc */}
              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="url(#goldGaugeGrad)"
                strokeWidth="14"
                fill="none"
                strokeDasharray={`${arcLength} ${circumference}`}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                style={{
                  transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-5xl font-black tracking-tight text-white font-mono">
                {overall_score}
              </span>
              <span className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest mt-0.5">
                out of 100
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-300 max-w-xs leading-relaxed">
            {summary}
          </p>
        </div>

        {/* Right: 5 Factors Breakdown */}
        <div className="lg:col-span-7 space-y-3.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400/80 mb-2">
            Factor Weightage & Performance
          </h4>

          {factors.map((f, i) => {
            const factorScore = Math.round(f.score);
            let barColor = 'bg-gradient-to-r from-amber-500 to-yellow-400';
            let badgeStyle = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
            if (f.status === 'Fair') {
              barColor = 'bg-gradient-to-r from-amber-600 to-orange-500';
              badgeStyle = 'bg-orange-500/10 text-orange-300 border-orange-500/30';
            } else if (f.status === 'Needs Attention' || f.status === 'Critical') {
              barColor = 'bg-gradient-to-r from-rose-600 to-red-500';
              badgeStyle = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
            } else if (f.status === 'Good') {
              barColor = 'bg-gradient-to-r from-yellow-500 to-amber-400';
              badgeStyle = 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30';
            }

            return (
              <div key={i} className="p-3.5 rounded-2xl bg-[#161620]/90 border border-slate-800/90">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">
                      {f.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ({Math.round(f.weight * 100)}% weight)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                      {f.status}
                    </span>
                    <span className="font-bold text-amber-300 font-mono">
                      {factorScore}/100
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-1000`}
                    style={{ width: `${Math.min(100, Math.max(5, factorScore))}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                  {f.explanation}
                </p>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
