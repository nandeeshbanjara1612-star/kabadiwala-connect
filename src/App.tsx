/**
 * Kabadiwala Connect - Collector Dashboard
 * Data-driven, functional architecture preserving the 100% exact design.
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { Sidebar, NavTab } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/views/DashboardView';
import { PickupRequestsView } from './components/views/PickupRequestsView';
import { MyPickupsView } from './components/views/MyPickupsView';
import { WastePassportView } from './components/views/WastePassportView';
import { TransactionsView } from './components/views/TransactionsView';
import { NotificationsView } from './components/views/NotificationsView';
import { ProfileView } from './components/views/ProfileView';
import { SupportView } from './components/views/SupportView';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { CompletePickupModal } from './components/CompletePickupModal';
import { AuthModal } from './components/AuthModal';

function MainLayout() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenCompleteModal={() => setIsCompleteModalOpen(true)}
          />
        );
      case 'requests':
        return (
          <PickupRequestsView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
        );
      case 'my-pickups':
        return <MyPickupsView />;
      case 'passports':
        return <WastePassportView />;
      case 'transactions':
        return <TransactionsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'profile':
        return <ProfileView />;
      case 'support':
        return <SupportView />;
      default:
        return (
          <DashboardView
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenCompleteModal={() => setIsCompleteModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans text-slate-900 overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <TopHeader
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
        />

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderActiveView()}</div>
        </main>
      </div>

      {/* Modals & Drawers */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <CompletePickupModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        onCompleteSuccess={(passportId) => {
          // Switch to passports tab to view the generated passport certificate
          setCurrentTab('passports');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <MainLayout />
      </DashboardProvider>
    </AuthProvider>
  );
}
