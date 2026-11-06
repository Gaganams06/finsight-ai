import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, AlertTriangle, Download, Sparkles, Loader2 } from 'lucide-react';

export default function UploadZone({ onFileSelected, isLoading, loadingStep, error, onTrySample }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (!file) return;
    onFileSelected(file);
  };

  const downloadSampleFile = (type) => {
    let filename = 'sample_statement_sbi.csv';
    let sampleContent = '';

    if (type === 'sbi') {
      filename = 'sample_statement_sbi.csv';
      sampleContent = `Txn Date,Value Date,Description,Ref No/Cheque,Debit,Credit,Balance
01/01/2024,01/01/2024,SALARY CR / WIPRO TECHNOLOGIES JAN2024,CMS91823901,,85000.00,112450.00
03/01/2024,03/01/2024,NEFT DR / HOUSE RENT JAN24 / SURESH KUMAR,NFT1928301,22000.00,,90450.00
05/01/2024,05/01/2024,ACH DR / ZERODHA BROKING MUTUAL FUND SIP,ACH0192831,10000.00,,80450.00
07/01/2024,07/01/2024,NACH DR / SBI CAR LOAN EMI DEBIT,NACH918230,11400.00,,69050.00
09/01/2024,09/01/2024,UPI/DR/40192831/BESCOM ELEC BILL/bescom@sbi,UPI0192831,1650.00,,67400.00
11/01/2024,11/01/2024,UPI/DR/40281923/BLINKIT GROCERY/blinkit@axis,UPI8192831,1480.00,,65920.00
14/01/2024,14/01/2024,UPI/DR/40391820/SWIGGY FOOD ORDER/swiggy@icici,UPI9182381,640.00,,65280.00
15/01/2024,15/01/2024,POS DR NETFLIX SERVICES MUMBAI,POS9182301,649.00,,64631.00
18/01/2024,18/01/2024,UPI/DR/40491823/UBER TRIP/uber@hdfcbank,UPI1029381,420.00,,64211.00
20/01/2024,20/01/2024,POS DR HPCL AUTO FUELS BANGALORE,POS0192831,2500.00,,61711.00`;
    } else if (type === 'icici') {
      filename = 'sample_statement_icici.csv';
      sampleContent = `Value Date,Transaction Date,Cheque Number,Transaction Remarks,Withdrawal Amount (INR),Deposit Amount (INR),Balance (INR)
01/10/2023,01/10/2023,-,SALARY FROM TCS MUMBAI OCT23,-,110000.00,165000.00
03/10/2023,03/10/2023,-,RTGS TO APARTMENT RENT / ANIL JOSHI,28000.00,-,137000.00
05/10/2023,05/10/2023,-,SIP DEBIT HDFC TOP 100 MUTUAL FUND,20000.00,-,117000.00
07/10/2023,07/10/2023,-,AUTO DEBIT ICICI HOME LOAN EMI,18500.00,-,98500.00
10/10/2023,10/10/2023,-,AIRTEL BROADBAND FIBER BILL,1179.00,-,97321.00
14/10/2023,14/10/2023,-,ZEPTO QUICK COMMERCE GROCERIES,2340.00,-,92831.00
16/10/2023,16/10/2023,-,SWIGGY ONLINE FOOD DELIVERY,890.00,-,91941.00`;
    }

    const blob = new Blob([sampleContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="upload-section" className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-slate-800 bg-[#121218]/90 hover:border-amber-500/50 hover:bg-[#161620]'
        } ${isLoading ? 'pointer-events-none opacity-90' : ''} shadow-xl shadow-black/40`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        {isLoading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-amber-950 border-t-amber-400 animate-spin" />
              <Loader2 className="w-8 h-8 text-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <div>
              <p className="text-base font-bold text-white">
                {loadingStep || 'Analyzing statement in volatile memory...'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Parsing transactions, running ML categorization, and computing health score
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Drop your bank statement here
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                or <span className="text-amber-400 font-semibold underline underline-offset-2">browse files</span> from your device
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                PDF
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                CSV
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 text-slate-300 border border-slate-700/60">
                Excel (.xlsx, .xls)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Max 10 MB
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-rose-950/40 border border-rose-900/60 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-rose-200">
            <p className="font-bold">Unable to process statement</p>
            <p className="mt-0.5 text-rose-300/90">{error}</p>
          </div>
        </div>
      )}

      {/* Quick Test / Sample Download Drawer */}
      <div className="mt-6 p-4 rounded-2xl bg-[#121218]/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="text-center sm:text-left">
          <p className="text-xs font-bold text-amber-300 flex items-center justify-center sm:justify-start gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            Want to test with sample files?
          </p>
          <p className="text-[11px] text-slate-400">
            Download verified test statements or launch the instant demo.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => downloadSampleFile('sbi')}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-amber-500/40 hover:bg-[#1a1a24] text-slate-300 hover:text-white transition inline-flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>SBI CSV</span>
          </button>
          <button
            onClick={() => downloadSampleFile('icici')}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-amber-500/40 hover:bg-[#1a1a24] text-slate-300 hover:text-white transition inline-flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            <span>ICICI CSV</span>
          </button>
          <button
            onClick={onTrySample}
            className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 hover:brightness-110 transition inline-flex items-center gap-1 shadow-md shadow-amber-500/20"
          >
            <Sparkles className="w-3 h-3 text-slate-950" />
            <span>Quick Demo</span>
          </button>
        </div>
      </div>

    </div>
  );
}
