import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/formatters';

export default function TransactionsTable({ transactions, currency = '₹' }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const categories = useMemo(() => {
    if (!transactions) return [];
    const set = new Set(transactions.map((t) => t.category));
    return Array.from(set).sort();
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter((t) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        !search ||
        t.description.toLowerCase().includes(searchLower) ||
        (t.merchant && t.merchant.toLowerCase().includes(searchLower)) ||
        t.debit.toString().includes(searchLower) ||
        t.credit.toString().includes(searchLower);

      const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;

      let matchesType = true;
      if (selectedType === 'DEBIT') matchesType = t.debit > 0;
      if (selectedType === 'CREDIT') matchesType = t.credit > 0;

      return matchesSearch && matchesCat && matchesType;
    });
  }, [transactions, search, selectedCategory, selectedType]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedTransactions.slice(start, start + pageSize);
  }, [sortedTransactions, currentPage, pageSize]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  return (
    <div className="p-6 sm:p-7 rounded-3xl bg-[#121218]/95 border border-amber-500/20 shadow-xl shadow-black/40">
      
      {/* Table Header Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 border-b border-slate-800 gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Transactions Ledger
            </h3>
            <p className="text-xs text-slate-400">
              Showing {sortedTransactions.length} of {transactions?.length || 0} extracted transactions
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search narration, merchant..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-800 bg-[#161620] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/60 focus:border-amber-500/60 w-44 sm:w-56"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-[#161620] text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="px-2.5 py-1.5 rounded-xl border border-slate-800 bg-[#161620] text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/60"
          >
            <option value="ALL">All Types</option>
            <option value="DEBIT">Debits Only</option>
            <option value="CREDIT">Credits Only</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
              <th
                onClick={() => toggleSort('date')}
                className="py-3 px-3 cursor-pointer hover:text-amber-400 transition"
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3">Description & Merchant</th>
              <th
                onClick={() => toggleSort('category')}
                className="py-3 px-3 cursor-pointer hover:text-amber-400 transition"
              >
                <div className="flex items-center space-x-1">
                  <span>Category</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('debit')}
                className="py-3 px-3 text-right cursor-pointer hover:text-amber-400 transition"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Debit (-)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('credit')}
                className="py-3 px-3 text-right cursor-pointer hover:text-amber-400 transition"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Credit (+)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('balance')}
                className="py-3 px-3 text-right cursor-pointer hover:text-amber-400 transition"
              >
                <div className="flex items-center justify-end space-x-1">
                  <span>Balance</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((t) => (
                <tr
                  key={t.id}
                  className={`hover:bg-[#1a1a24] transition ${
                    t.is_anomaly ? 'bg-amber-950/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 whitespace-nowrap text-slate-400 font-mono">
                    {formatDate(t.date)}
                  </td>
                  <td className="py-3 px-3 max-w-xs sm:max-w-md">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-slate-100 truncate" title={t.description}>
                        {t.description}
                      </span>
                      {t.is_anomaly && (
                        <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Anomaly
                        </span>
                      )}
                    </div>
                    {t.merchant && t.merchant !== 'Miscellaneous' && (
                      <p className="text-[10px] text-amber-400 font-bold mt-0.5">
                        {t.merchant}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1a1a26] border border-slate-700/80 text-slate-300 capitalize">
                      {t.category.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap font-bold text-rose-400 font-mono">
                    {t.debit > 0 ? formatCurrency(t.debit, currency) : '-'}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap font-bold text-amber-400 font-mono">
                    {t.credit > 0 ? formatCurrency(t.credit, currency) : '-'}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap text-slate-200 font-mono">
                    {t.balance !== null ? formatCurrency(t.balance, currency) : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                  No transactions match your search or filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 mt-2 border-t border-slate-800 text-xs text-slate-400 gap-2">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-800 disabled:opacity-30 hover:border-amber-500/40 hover:bg-[#1a1a24] text-slate-300 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-800 disabled:opacity-30 hover:border-amber-500/40 hover:bg-[#1a1a24] text-slate-300 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
