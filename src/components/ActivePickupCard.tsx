import React, { useState } from 'react';
import {
  PackageCheck,
  MapPin,
  Clock,
  IndianRupee,
  Navigation,
  CheckCircle,
  Phone,
  Scale,
  Loader2,
  AlertTriangle,
  FileCheck2,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { PickupStatus } from '../types';

interface ActivePickupCardProps {
  onOpenCompleteModal: () => void;
}

export const ActivePickupCard: React.FC<ActivePickupCardProps> = ({ onOpenCompleteModal }) => {
  const {
    activePickup,
    isLoadingActivePickup,
    updatePickupStatus,
  } = useDashboard();

  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const handleAdvanceStatus = async (nextStatus: PickupStatus) => {
    if (!activePickup) return;
    setIsUpdatingStatus(true);
    setStatusError(null);
    try {
      await updatePickupStatus(activePickup.id, nextStatus);
    } catch (err: any) {
      setStatusError(err?.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const statusSteps: { status: PickupStatus; label: string }[] = [
    { status: 'ACCEPTED', label: 'Accepted' },
    { status: 'ON_THE_WAY', label: 'On The Way' },
    { status: 'ARRIVED', label: 'Arrived' },
    { status: 'COLLECTING', label: 'Collecting' },
    { status: 'COMPLETED', label: 'Completed' },
  ];

  const getStepIndex = (status: PickupStatus) => {
    switch (status) {
      case 'PENDING':
      case 'ASSIGNED':
      case 'ACCEPTED':
        return 0;
      case 'ON_THE_WAY':
        return 1;
      case 'ARRIVED':
        return 2;
      case 'COLLECTING':
        return 3;
      case 'COMPLETED':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = activePickup ? getStepIndex(activePickup.status) : 0;

  return (
    <div id="active-pickup-card" className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <PackageCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Active Pickup</h2>
            <p className="text-xs text-slate-500">Current assigned trip details</p>
          </div>
        </div>
        {activePickup && (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 animate-pulse">
            In Progress
          </span>
        )}
      </div>

      {statusError && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{statusError}</span>
        </div>
      )}

      {/* Content */}
      {isLoadingActivePickup ? (
        <div className="space-y-4 py-6 animate-pulse">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-10 bg-slate-100 rounded w-full" />
          <div className="h-24 bg-slate-50 rounded w-full" />
        </div>
      ) : !activePickup ? (
        <div id="active-pickup-empty" className="py-12 text-center my-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <PackageCheck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No active pickup</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Accept a nearby pickup request to start a live collection trip and generate a waste passport.
          </p>
        </div>
      ) : (
        <div id="active-pickup-details" className="space-y-5">
          {/* Pickup Meta banner */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">{activePickup.id}</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-600 text-white">
                  {activePickup.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-700 font-semibold">{activePickup.customerName}</p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>{activePickup.customerPhone}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium block">Est. Payout</span>
              <div className="flex items-center justify-end gap-0.5 text-emerald-700 font-bold text-base">
                <IndianRupee className="w-4 h-4" />
                <span>{activePickup.estimatedPayout}</span>
              </div>
            </div>
          </div>

          {/* Location & Time */}
          <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-slate-800">{activePickup.address}</span>
                {activePickup.landmark && (
                  <p className="text-[11px] text-slate-500">Landmark: {activePickup.landmark}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500 pt-1 border-t border-slate-200/50">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Slot: {activePickup.scheduledTime}</span>
            </div>
          </div>

          {/* Status Progress Timeline */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Pickup Journey</p>
            <div className="grid grid-cols-5 gap-1 text-center">
              {statusSteps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.status} className="space-y-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-colors ${
                        isPassed ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    />
                    <span
                      className={`text-[10px] font-medium block truncate ${
                        isCurrent
                          ? 'text-emerald-700 font-bold'
                          : isPassed
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Materials breakdown */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-slate-700">Declared Materials</span>
            <div className="grid grid-cols-2 gap-2">
              {activePickup.items.map((item) => (
                <div
                  key={item.id}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-700 font-medium">{item.category}</span>
                  <span className="font-semibold text-slate-900">{item.estimatedWeightKg} kg</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Progression Controls */}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {activePickup.status === 'ACCEPTED' && (
              <button
                id="btn-on-the-way"
                onClick={() => handleAdvanceStatus('ON_THE_WAY')}
                disabled={isUpdatingStatus}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                <span>Start Trip (On The Way)</span>
              </button>
            )}

            {activePickup.status === 'ON_THE_WAY' && (
              <button
                id="btn-mark-arrived"
                onClick={() => handleAdvanceStatus('ARRIVED')}
                disabled={isUpdatingStatus}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                <span>Mark Arrived at Location</span>
              </button>
            )}

            {activePickup.status === 'ARRIVED' && (
              <button
                id="btn-start-collecting"
                onClick={() => handleAdvanceStatus('COLLECTING')}
                disabled={isUpdatingStatus}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {isUpdatingStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Scale className="w-4 h-4" />
                )}
                <span>Start Weighing & Collecting</span>
              </button>
            )}

            {activePickup.status === 'COLLECTING' && (
              <button
                id="btn-complete-pickup"
                onClick={onOpenCompleteModal}
                className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Verify Weights & Complete Pickup</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
