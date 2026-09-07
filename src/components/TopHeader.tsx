import React, { useState } from 'react';
import {
  MapPin,
  Bell,
  CheckCircle2,
  Clock,
  CircleSlash,
  ChevronDown,
  RefreshCw,
  Radio,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../context/DashboardContext';
import { CollectorAvailability } from '../types';

interface TopHeaderProps {
  onOpenNotifications: () => void;
  onOpenAuthModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onOpenNotifications, onOpenAuthModal }) => {
  const { isAuthenticated, currentUser, currentCollector, updateAvailability } = useAuth();
  const { location, isLocationLive, unreadNotifCount, requestLiveLocation } = useDashboard();
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const availability = currentCollector?.availability || 'OFFLINE';

  const handleSelectStatus = async (status: CollectorAvailability) => {
    setIsStatusDropdownOpen(false);
    if (!isAuthenticated) return;
    try {
      setIsUpdatingStatus(true);
      await updateAvailability(status);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const statusConfig = {
    AVAILABLE: {
      label: 'Available',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dotClass: 'bg-emerald-500',
      icon: CheckCircle2,
    },
    BUSY: {
      label: 'Busy',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500',
      icon: Clock,
    },
    OFFLINE: {
      label: 'Offline',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      dotClass: 'bg-slate-400',
      icon: CircleSlash,
    },
  };

  const currentStatusConfig = statusConfig[availability] || statusConfig.OFFLINE;

  return (
    <header id="top-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3.5 flex items-center justify-between shadow-xs">
      {/* Location Section */}
      <div id="header-location" className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
          <MapPin className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-800">
              {location?.addressText || (isAuthenticated ? 'Current Zone: Indiranagar Cluster 04' : 'Location: Unavailable')}
            </span>
            {isLocationLive && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 animate-pulse">
                <Radio className="w-2.5 h-2.5" />
                Live
              </span>
            )}
          </div>
          <button
            onClick={requestLiveLocation}
            className="text-[11px] text-slate-400 hover:text-emerald-600 flex items-center gap-1 text-left transition-colors"
          >
            <span>{isLocationLive ? 'GPS active' : 'Click to detect browser GPS'}</span>
            <RefreshCw className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* Right Controls: Availability Dropdown, Notification Icon, User Profile */}
      <div id="header-actions" className="flex items-center gap-3">
        {/* Availability Status Dropdown */}
        {isAuthenticated && (
          <div className="relative">
            <button
              id="availability-dropdown-btn"
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              disabled={isUpdatingStatus}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${currentStatusConfig.badgeClass}`}
            >
              <span className={`w-2 h-2 rounded-full ${currentStatusConfig.dotClass}`} />
              <span>{currentStatusConfig.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isStatusDropdownOpen && (
              <div
                id="availability-menu"
                className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-40"
              >
                <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Set Availability
                </div>
                {(['AVAILABLE', 'BUSY', 'OFFLINE'] as CollectorAvailability[]).map((status) => {
                  const itemConfig = statusConfig[status];
                  return (
                    <button
                      key={status}
                      id={`status-option-${status.toLowerCase()}`}
                      onClick={() => handleSelectStatus(status)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 transition-colors ${
                        availability === status ? 'text-emerald-700 font-semibold bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${itemConfig.dotClass}`} />
                      <span>{itemConfig.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Notifications Icon Button */}
        <button
          id="header-notifications-btn"
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifCount > 0 && (
            <span
              id="notification-badge-count"
              className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-bold flex items-center justify-center border-2 border-white"
            >
              {unreadNotifCount}
            </span>
          )}
        </button>

        {/* User profile action */}
        {isAuthenticated && currentUser ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 leading-tight">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400 font-medium">Collector</p>
            </div>
          </div>
        ) : (
          <button
            id="header-signin-btn"
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
