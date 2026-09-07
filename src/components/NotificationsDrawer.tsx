import React from 'react';
import { Bell, Check, X, CheckCheck } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadNotifCount, markNotificationRead, markAllNotificationsRead } =
    useDashboard();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        id="notifications-drawer"
        className="relative w-full max-w-sm bg-white shadow-2xl flex flex-col h-full z-10 animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              <p className="text-[11px] text-slate-500">{unreadNotifCount} unread updates</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadNotifCount > 0 && (
              <button
                id="mark-all-read-btn"
                onClick={() => markAllNotificationsRead()}
                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div id="notifications-empty" className="py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">No new notifications</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Alerts on pickup requests, status updates, and payouts will appear here.
              </p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                id={`notification-item-${n.id}`}
                onClick={() => {
                  if (!n.isRead) markNotificationRead(n.id);
                }}
                className={`p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                  n.isRead
                    ? 'bg-white border-slate-200 text-slate-600'
                    : 'bg-emerald-50/70 border-emerald-200 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5">
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                      )}
                      <p className="font-bold text-slate-900 leading-tight">{n.title}</p>
                    </div>
                    <p className="text-slate-600 leading-normal">{n.message}</p>
                    <p className="text-[10px] text-slate-400 font-medium pt-1">
                      {new Date(n.createdAt).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationRead(n.id);
                      }}
                      className="p-1 rounded-md text-emerald-600 hover:bg-emerald-100"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
