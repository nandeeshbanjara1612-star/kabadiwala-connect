import React from 'react';
import { History, CheckCircle, IndianRupee, Radio, Award } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

export const RecentActivityCard: React.FC = () => {
  const { metrics, isLoadingMetrics } = useDashboard();
  const activities = metrics?.recentActivity || [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'pickup':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'earnings':
        return <IndianRupee className="w-4 h-4 text-blue-600" />;
      case 'passport':
        return <Award className="w-4 h-4 text-teal-600" />;
      default:
        return <Radio className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatTimestamp = (ts: string) => {
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div id="recent-activity-card" className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col h-full">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
            <p className="text-xs text-slate-500">Live operational & payout log</p>
          </div>
        </div>
      </div>

      {isLoadingMetrics ? (
        <div className="space-y-3 py-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-200" />
              <div className="space-y-1 flex-1">
                <div className="h-3.5 bg-slate-200 rounded w-1/2" />
                <div className="h-2.5 bg-slate-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div id="recent-activity-empty" className="py-10 text-center my-auto">
          <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
            <History className="w-5 h-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No recent activity</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Your accepted pickups, verified weights, and instant UPI payouts will appear here.
          </p>
        </div>
      ) : (
        <div id="recent-activity-list" className="space-y-3 overflow-y-auto max-h-[320px] pr-1">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
            >
              <div className="p-1.5 rounded-lg bg-slate-100 mt-0.5">{getIcon(act.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold text-slate-900 truncate">{act.action}</p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {formatTimestamp(act.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{act.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
