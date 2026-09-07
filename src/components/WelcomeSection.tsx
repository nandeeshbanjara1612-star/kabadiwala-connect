import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WelcomeSection: React.FC = () => {
  const { currentUser, isAuthenticated } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = 'Good Morning';
    if (hour >= 12 && hour < 17) {
      timeGreeting = 'Good Afternoon';
    } else if (hour >= 17) {
      timeGreeting = 'Good Evening';
    }

    if (isAuthenticated && currentUser?.name) {
      return `${timeGreeting}, ${currentUser.name}!`;
    }
    return `${timeGreeting}!`;
  };

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <div id="welcome-section" className="bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 rounded-2xl p-6 text-white shadow-sm border border-emerald-950/40 relative overflow-hidden">
      {/* Subtle decorative background accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kabadiwala Connect Network</span>
          </div>
          <h1 id="welcome-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {getGreeting()}
          </h1>
          <p className="text-sm text-slate-300">
            {isAuthenticated
              ? 'Ready to accept verified scrap pickups and record transparent waste passports.'
              : 'Sign in to access your collector route, active bookings, and instant UPI payouts.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-slate-200 self-start sm:self-center">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{todayFormatted}</span>
        </div>
      </div>
    </div>
  );
};
