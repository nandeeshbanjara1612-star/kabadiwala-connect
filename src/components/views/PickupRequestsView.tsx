import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  Clock,
  IndianRupee,
  Layers,
  Check,
  X,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';

interface PickupRequestsViewProps {
  onOpenAuthModal: () => void;
}

export const PickupRequestsView: React.FC<PickupRequestsViewProps> = ({ onOpenAuthModal }) => {
  const { isAuthenticated } = useAuth();
  const { nearbyPickups, acceptPickup, rejectPickup, refreshDashboardData, isLoadingPickups } =
    useDashboard();

  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredPickups = nearbyPickups.filter((p) => {
    const matchesSearch =
      p.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(filterQuery.toLowerCase());

    if (selectedCategory === 'ALL') return matchesSearch;
    const hasCategory = p.items.some(
      (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
    );
    return matchesSearch && hasCategory;
  });

  return (
    <div id="pickup-requests-view" className="space-y-6">
      {/* Header banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Pickup Requests Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time pickup requests available in your operational cluster.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refreshDashboardData()}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by request ID, area or address..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
          {['ALL', 'Paper', 'Plastic', 'Metal', 'Cardboard', 'E-Waste'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      {isLoadingPickups ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
              <div className="h-8 bg-slate-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredPickups.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No pickup requests nearby</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All current nearby requests have been accepted or no new bookings match your filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPickups.map((pickup) => {
            const totalEstimatedWeight = pickup.items.reduce(
              (sum, it) => sum + it.estimatedWeightKg,
              0
            );

            return (
              <div
                key={pickup.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{pickup.id}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {pickup.distanceKm} km
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-emerald-700 font-bold text-sm bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                      <IndianRupee className="w-3.5 h-3.5" />
                      <span>{pickup.estimatedPayout}</span>
                    </div>
                  </div>

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

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">
                      ~{totalEstimatedWeight} kg
                    </span>
                    {pickup.items.map((item) => (
                      <span
                        key={item.id}
                        className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600"
                      >
                        {item.category}
                      </span>
                    ))}
                  </div>

                  {pickup.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{pickup.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) onOpenAuthModal();
                      else acceptPickup(pickup.id);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Request</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!isAuthenticated) onOpenAuthModal();
                      else rejectPickup(pickup.id);
                    }}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
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
