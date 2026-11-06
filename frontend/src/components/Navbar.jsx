import React from 'react';
import { ShieldCheck, Moon, Sun, Sparkles, RefreshCw, FileText } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode, onTrySample, onReset, hasData, onOpenReport }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-900/20 dark:border-amber-500/10 bg-[#0d0d12]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onReset}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/30">
            <span className="font-black text-xl tracking-tight">F</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">
                Finsight <span className="bg-gradient-to-r from-amber-400 to-yellow-300 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Centurion
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Private Wealth & Health Monitoring
            </p>
          </div>
        </div>

        {/* Center Trust Tag */}
        <div className="hidden md:flex items-center space-x-2 text-xs font-semibold text-amber-300 bg-amber-500/5 border border-amber-500/20 px-3.5 py-1.5 rounded-full shadow-inner">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Zero-Storage • 100% In-Memory Intel</span>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {hasData ? (
            <>
              <button
                onClick={onOpenReport}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-xl border border-amber-500/30 bg-[#14141c] text-amber-200 hover:bg-amber-500/10 hover:border-amber-500/50 transition shadow-sm"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Export Report</span>
              </button>
              <button
                onClick={onReset}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-medium px-3 py-1.5 rounded-xl border border-slate-800 bg-[#14141c] text-slate-300 hover:text-white hover:border-slate-700 transition"
                title="Analyze Another Statement"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">New Statement</span>
              </button>
            </>
          ) : (
            <button
              onClick={onTrySample}
              className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-slate-950 hover:brightness-110 transition shadow-md shadow-amber-500/20 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Try Sample Data</span>
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle Theme"
            className="p-2 rounded-xl border border-slate-800 bg-[#14141c] text-slate-300 hover:text-amber-400 hover:border-amber-500/30 transition"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>
        </div>

      </div>
    </header>
  );
}
