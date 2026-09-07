import React from 'react';
import { IndianRupee, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const MetricCards: React.FC = () => {
  const { metrics, isLoadingMetrics } = useDashboard();

  const cards = [
    {
      id: 'metric-card-earnings',
      title: "Today's Earnings",
      value: metrics ? `₹${metrics.todaysEarnings.toLocaleString('en-IN')}` : '₹0',
      icon: IndianRupee,
      iconBg: 'bg-emerald-50 text-emerald-600',
      borderHover: 'hover:border-emerald-300',
    },
    {
      id: 'metric-card-completed',
      title: 'Completed Pickups',
      value: metrics ? `${metrics.completedPickupsToday}` : '0',
      icon: CheckCircle2,
      iconBg: 'bg-blue-50 text-blue-600',
      borderHover: 'hover:border-blue-300',
    },
    {
      id: 'metric-card-trust-score',
      title: 'Trust Score',
      value: metrics?.trustScore !== null && metrics?.trustScore !== undefined ? `${metrics.trustScore}%` : '—',
      icon: ShieldCheck,
      iconBg: 'bg-teal-50 text-teal-600',
      borderHover: 'hover:border-teal-300',
    },
    {
      id: 'metric-card-total-pickups',
      title: 'Total Pickups',
      value: metrics ? `${metrics.totalPickups}` : '0',
      icon: Truck,
      iconBg: 'bg-indigo-50 text-indigo-600',
      borderHover: 'hover:border-indigo-300',
    },
  ];

  if (isLoadingMetrics) {
    return (
      <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs animate-pulse flex items-center justify-between"
          >
            <div className="space-y-2">
              <div className="h-3.5 w-24 bg-slate-200 rounded" />
              <div className="h-7 w-16 bg-slate-200 rounded" />
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div id="metrics-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className={`p-5 bg-white rounded-xl border border-slate-200 shadow-xs transition-all duration-200 ${card.borderHover} flex items-center justify-between`}
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{card.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg} shadow-xs`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
