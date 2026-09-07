import React, { useState } from 'react';
import {
  Receipt,
  IndianRupee,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  Search,
  Filter,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const TransactionsView: React.FC = () => {
  const { transactions } = useDashboard();
  const [searchQuery, setSearchQuery] = useState('');

  const totalEarnings = transactions
    .filter((t) => t.status === 'SUCCESS')
    .reduce((acc, t) => acc + t.amount, 0);

  const filtered = transactions.filter((t) => {
    return (
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.pickupId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div id="transactions-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            <span>Earnings & Payout Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time automated UPI settlements for all verified pickups.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Total Lifetime Settled</span>
            <span className="text-lg font-bold text-slate-900">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by Transaction ID, UPI Reference, or Pickup ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-emerald-500"
        />
      </div>

      {/* Table / List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Receipt className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No transactions recorded</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Once pickups are completed and weighed, instant UPI settlements will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Transaction ID</th>
                  <th className="px-5 py-3.5">Pickup ID</th>
                  <th className="px-5 py-3.5">Settlement Mode</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5 text-right">Amount</th>
                  <th className="px-5 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900">
                      <div>
                        <span>{tx.id}</span>
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Ref: {tx.referenceId}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">#{tx.pickupId}</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium">
                        {tx.paymentMode.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {new Date(tx.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right font-bold text-emerald-700 text-sm">
                      +₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
