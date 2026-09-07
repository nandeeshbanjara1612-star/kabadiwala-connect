import React from 'react';
import { WelcomeSection } from '../WelcomeSection';
import { MetricCards } from '../MetricCards';
import { NearbyPickupsCard } from '../NearbyPickupsCard';
import { ActivePickupCard } from '../ActivePickupCard';
import { RecentActivityCard } from '../RecentActivityCard';

interface DashboardViewProps {
  onOpenAuthModal: () => void;
  onOpenCompleteModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAuthModal,
  onOpenCompleteModal,
}) => {
  return (
    <div id="dashboard-view-content" className="space-y-6">
      {/* 1. Welcome Section */}
      <WelcomeSection />

      {/* 2. Metric Cards: Earnings, Completed Pickups, Trust Score, Total Pickups */}
      <MetricCards />

      {/* 3. Operational Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Nearby Pickup Requests */}
        <div className="lg:col-span-7 h-full">
          <NearbyPickupsCard onOpenAuthModal={onOpenAuthModal} />
        </div>

        {/* Right Column: Active Pickup & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          <ActivePickupCard onOpenCompleteModal={onOpenCompleteModal} />
          <RecentActivityCard />
        </div>
      </div>
    </div>
  );
};
