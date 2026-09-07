import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  IndianRupee,
  Layers,
  Check,
  X,
  AlertCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { useAuth } from '../context/AuthContext';

interface NearbyPickupsCardProps {
  onOpenAuthModal: () => void;
}

export const NearbyPickupsCard: React.FC<NearbyPickupsCardProps> = ({ onOpenAuthModal }) => {
  const { isAuthenticated } = useAuth();
  const {
    nearbyPickups,
    isLoadingPickups,
    errorPickups,
    acceptPickup,
    rejectPickup,
    refreshDashboardData,
  } = useDashboard();

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleAccept = async (id: string) => {
    if (!isAuthenticated) {
      onOpenAuthModal();
      return;
    }
    setActionError(null);
    setProcessingId(id);
    try {
      await acceptPickup(id);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to accept pickup');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!isAuthenticated) {
      onOpenAuthModal();
      return;
    }
    setActionError(null);
    setProcessingId(id);
    try {
      await rejectPickup(id);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to reject pickup');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div id="nearby-pickups-card" className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Nearby Pickup Requests</h2>
            <p className="text-xs text-slate-500">Live requests ready for collection</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            {nearbyPickups.length} Available
          </span>
          <button
            onClick={() => refreshDashboardData()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Refresh requests"
            aria-label="Refresh requests"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionError && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Content body */}
      {isLoadingPickups ? (
        <div className="space-y-3 py-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
              <div className="h-8 bg-slate-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : errorPickups ? (
        <div id="nearby-pickups-error" className="py-8 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Unable to load pickup requests</p>
            <p className="text-xs text-slate-500">{errorPickups}</p>
          </div>
          <button
            id="retry-pickups-btn"
            onClick={() => refreshDashboardData()}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500 transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : nearbyPickups.length === 0 ? (
        <div id="nearby-pickups-empty" className="py-12 text-center my-auto">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No pickup requests nearby</p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            When new households or businesses in your cluster schedule pickups, they will appear here in real-time.
          </p>
        </div>
      ) : (
        <div id="nearby-pickups-list" className="space-y-3.5 overflow-y-auto max-h-[460px] pr-1">
          {nearbyPickups.map((pickup) => {
            const isBusy = processingId === pickup.id;
            const totalEstimatedWeight = pickup.items.reduce((sum, it) => sum + it.estimatedWeightKg, 0);

            return (
              <div
                key={pickup.id}
                id={`pickup-item-${pickup.id}`}
                className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 bg-slate-50/40 transition-all duration-150 space-y-3"
              >
                {/* Top row: ID, Distance, Payout */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{pickup.id}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700 font-medium">
                      {pickup.distanceKm} km away
                    </span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-emerald-700 text-sm bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>{pickup.estimatedPayout}</span>
                  </div>
                </div>

                {/* Address & scheduled time */}
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{pickup.address}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{pickup.scheduledTime}</span>
                  </div>
                </div>

                {/* Waste materials badges */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] font-medium text-slate-700">
                    <Layers className="w-3 h-3 text-emerald-600" />
                    <span>~{totalEstimatedWeight} kg total</span>
                  </div>
                  {pickup.items.map((item) => (
                    <span
                      key={item.id}
                      className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] text-slate-600 font-medium"
                    >
                      {item.category} ({item.estimatedWeightKg}kg)
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
                  <button
                    id={`accept-btn-${pickup.id}`}
                    onClick={() => handleAccept(pickup.id)}
                    disabled={isBusy}
                    className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
                  >
                    {isBusy ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Check className="w-3.5 h-3.5" />
                    )}
                    <span>Accept</span>
                  </button>

                  <button
                    id={`reject-btn-${pickup.id}`}
                    onClick={() => handleReject(pickup.id)}
                    disabled={isBusy}
                    className="py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
