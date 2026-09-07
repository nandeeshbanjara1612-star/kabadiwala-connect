import React from 'react';
import { Bell, CheckCheck, Check, Clock } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

export const NotificationsView: React.FC = () => {
  const { notifications, unreadNotifCount, markNotificationRead, markAllNotificationsRead } =
    useDashboard();

  return (
    <div id="notifications-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <span>Operational Notifications</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            System alerts, pickup updates, and transaction confirmations.
          </p>
        </div>

        {unreadNotifCount > 0 && (
          <button
            onClick={() => markAllNotificationsRead()}
            className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-center"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All as Read ({unreadNotifCount})</span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No new notifications</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You are completely caught up with all operational alerts.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                if (!n.isRead) markNotificationRead(n.id);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                n.isRead
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-emerald-50/70 border-emerald-300 text-slate-900 shadow-xs'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  {!n.isRead && (
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 flex-shrink-0" />
                  )}
                  <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600 uppercase">
                    {n.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{n.message}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                  <Clock className="w-3 h-3" />
                  <span>{new Date(n.createdAt).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {!n.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markNotificationRead(n.id);
                  }}
                  className="p-2 rounded-xl text-emerald-700 hover:bg-emerald-100 transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
