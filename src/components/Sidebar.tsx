import React from 'react';
import {
  LayoutDashboard,
  Truck,
  PackageCheck,
  Award,
  Receipt,
  Bell,
  UserCheck,
  LifeBuoy,
  LogOut,
  Recycle,
  LogIn,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';

export type NavTab =
  | 'dashboard'
  | 'requests'
  | 'my-pickups'
  | 'passports'
  | 'transactions'
  | 'notifications'
  | 'profile'
  | 'support';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAuthModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, onOpenAuthModal }) => {
  const { isAuthenticated, currentUser, currentCollector, logout } = useAuth();
  const { unreadNotifCount } = useDashboard();

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests' as NavTab, label: 'Pickup Requests', icon: Truck },
    { id: 'my-pickups' as NavTab, label: 'My Pickups', icon: PackageCheck },
    { id: 'passports' as NavTab, label: 'Waste Passport', icon: Award },
    { id: 'transactions' as NavTab, label: 'Transactions', icon: Receipt },
    {
      id: 'notifications' as NavTab,
      label: 'Notifications',
      icon: Bell,
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined,
    },
    { id: 'profile' as NavTab, label: 'Profile', icon: UserCheck },
    { id: 'support' as NavTab, label: 'Support', icon: LifeBuoy },
  ];

  return (
    <aside id="sidebar-container" className="w-64 bg-slate-900 text-slate-100 flex flex-col flex-shrink-0 border-r border-slate-800 min-h-screen">
      {/* Brand Header */}
      <div id="sidebar-brand" className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <Recycle className="w-6 h-6" />
        </div>
        <div>
          <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
            <span>Kabadiwala</span>
            <span className="text-emerald-400">Connect</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Collector Dashboard</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav id="sidebar-nav" className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500 text-slate-950">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collector Profile / Auth status at bottom of sidebar */}
      <div id="sidebar-footer" className="p-3 border-t border-slate-800 bg-slate-950/40">
        {isAuthenticated && currentUser ? (
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-2 py-1.5 rounded-md bg-slate-800/60 border border-slate-700/50">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-semibold text-xs uppercase">
                {currentUser.name.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentCollector?.vehicleNumber || 'Verified Collector'}</p>
              </div>
            </div>
            <button
              id="sidebar-logout-btn"
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            id="sidebar-login-btn"
            onClick={onOpenAuthModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-sm"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </aside>
  );
};
