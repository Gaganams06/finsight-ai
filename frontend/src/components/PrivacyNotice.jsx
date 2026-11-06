import React from 'react';
import { ShieldCheck, EyeOff, Lock } from 'lucide-react';

export default function PrivacyNotice() {
  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <div className="p-5 rounded-3xl bg-gradient-to-r from-[#14141c] via-[#101015] to-[#161620] border border-amber-500/20 shadow-xl shadow-black/30">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-slate-950 font-black shrink-0 mt-0.5 sm:mt-0 shadow-md shadow-amber-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Centurion Privacy Guarantee & Zero-Storage Safeguards
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Your bank statements are processed purely in volatile RAM buffer (<code className="text-amber-300 font-mono font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">io.BytesIO</code>) and immediately destroyed after analysis. We never store files, never persist database records, and never log account credentials.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-semibold text-amber-400/90 shrink-0">
            <span className="flex items-center gap-1">
              <EyeOff className="w-3.5 h-3.5" /> Account Masking
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> In-Memory Only
            </span>
          </div>
        </div>
      </div>
      
      {/* Regulatory disclaimer */}
      <p className="mt-2.5 text-center text-[11px] text-slate-500">
        Disclaimer: Finsight AI provides informational analytics and financial metrics only. It does not constitute certified financial, legal, or investment advisory.
      </p>
    </div>
  );
}
