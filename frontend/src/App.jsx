import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import PrivacyNotice from './components/PrivacyNotice';
import UploadZone from './components/UploadZone';
import HealthScoreGauge from './components/HealthScoreGauge';
import SummaryCards from './components/SummaryCards';
import MonthlyTrendChart from './components/MonthlyTrendChart';
import CategoryBreakdown from './components/CategoryBreakdown';
import MerchantsAndSubscriptions from './components/MerchantsAndSubscriptions';
import AnomalyAlerts from './components/AnomalyAlerts';
import BalanceTimelineChart from './components/BalanceTimelineChart';
import RecommendationsPanel from './components/RecommendationsPanel';
import TransactionsTable from './components/TransactionsTable';
import ReportModal from './components/ReportModal';
import { fetchSampleData, uploadStatement } from './services/api';
import { formatDate } from './utils/formatters';
import { FileText, RefreshCw, Calendar } from 'lucide-react';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('finsight_theme') === 'dark' ||
      (!('finsight_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [analysisData, setAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [error, setError] = useState(null);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('finsight_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('finsight_theme', 'light');
    }
  }, [darkMode]);

  const handleTrySample = async () => {
    setError(null);
    setIsLoading(true);
    setLoadingStep('Generating realistic Indian banking data...');

    try {
      setTimeout(() => setLoadingStep('Analyzing monthly cashflows & UPI streams...'), 600);
      setTimeout(() => setLoadingStep('Evaluating 5-factor Financial Health Score...'), 1200);

      const data = await fetchSampleData();
      setAnalysisData(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to load sample statement.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleFileSelected = async (file) => {
    setError(null);
    setIsLoading(true);
    setLoadingStep(`Streaming ${file.name} to in-memory parser...`);

    try {
      setTimeout(() => setLoadingStep('Extracting transaction ledger and detecting headers...'), 800);
      setTimeout(() => setLoadingStep('Classifying 13 spending categories & detecting anomalies...'), 1600);
      setTimeout(() => setLoadingStep('Computing Financial Health Score & advice...'), 2400);

      const data = await uploadStatement(file);
      setAnalysisData(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message || 'Failed to analyze statement.');
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleReset = () => {
    setAnalysisData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToUpload = () => {
    const el = document.getElementById('upload-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#09090d] text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onTrySample={handleTrySample}
        onReset={handleReset}
        hasData={!!analysisData}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {!analysisData ? (
          /* Landing & Upload View */
          <div>
            <Hero onTrySample={handleTrySample} onScrollToUpload={scrollToUpload} />
            <UploadZone
              onFileSelected={handleFileSelected}
              isLoading={isLoading}
              loadingStep={loadingStep}
              error={error}
              onTrySample={handleTrySample}
            />
            <HowItWorks />
            <PrivacyNotice />
          </div>
        ) : (
          /* Analysis Dashboard View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fadeIn">
            
            {/* Dashboard Header Bar */}
            <div className="p-5 sm:p-6 rounded-3xl bg-[#121218]/95 border border-amber-500/20 shadow-xl shadow-black/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {analysisData.meta?.bank_detected || 'Bank Statement'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {analysisData.meta?.account_mask}
                  </span>
                  <span className="text-xs text-slate-600">•</span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {formatDate(analysisData.meta?.start_date)} – {formatDate(analysisData.meta?.end_date)}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Financial Health & Spending Intelligence
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsReportOpen(true)}
                  className="inline-flex items-center space-x-1.5 text-xs font-extrabold px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-110 transition"
                >
                  <FileText className="w-4 h-4 text-slate-950" />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-slate-800 bg-[#161620] hover:border-amber-500/40 text-slate-300 hover:text-white transition"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Upload Another</span>
                </button>
              </div>
            </div>

            {/* Health Score Gauge */}
            <HealthScoreGauge healthScore={analysisData.health_score} />

            {/* Summary Metrics Cards */}
            <SummaryCards summary={analysisData.summary} currency={analysisData.meta?.currency || '₹'} />

            {/* Charts Row: Monthly Cashflow & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <MonthlyTrendChart monthlyTrends={analysisData.monthly_trends} currency={analysisData.meta?.currency || '₹'} />
              </div>
              <div className="lg:col-span-5">
                <CategoryBreakdown categories={analysisData.category_breakdown} currency={analysisData.meta?.currency || '₹'} />
              </div>
            </div>

            {/* Merchants & Recurring Subscriptions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7">
                <MerchantsAndSubscriptions
                  merchants={analysisData.top_merchants}
                  subscriptions={analysisData.recurring_subscriptions}
                  currency={analysisData.meta?.currency || '₹'}
                />
              </div>
              <div className="lg:col-span-5">
                <AnomalyAlerts
                  anomalies={analysisData.anomalies}
                  currency={analysisData.meta?.currency || '₹'}
                />
              </div>
            </div>

            {/* Balance Timeline Chart */}
            <BalanceTimelineChart
              dailyBalances={analysisData.daily_balances}
              adb={analysisData.summary?.average_daily_balance}
              lowBalanceDays={analysisData.summary?.low_balance_days}
              currency={analysisData.meta?.currency || '₹'}
            />

            {/* Strategic Recommendations */}
            <RecommendationsPanel recommendations={analysisData.recommendations} />

            {/* Full Transactions Table */}
            <TransactionsTable
              transactions={analysisData.transactions}
              currency={analysisData.meta?.currency || '₹'}
            />

            {/* Privacy note */}
            <PrivacyNotice />

          </div>
        )}
      </main>

      {/* Printable Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        data={analysisData}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#07070a] py-6 text-center text-xs text-slate-500">
        <p>© 2024 Finsight AI • Centurion Edition • Zero Storage Policy • 100% In-Memory Intel</p>
      </footer>

    </div>
  );
}
