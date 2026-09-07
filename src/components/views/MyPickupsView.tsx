import React, { useState } from 'react';
import {
  PackageCheck,
  MapPin,
  Clock,
  IndianRupee,
  Phone,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { PickupStatus } from '../../types';

export const MyPickupsView: React.FC = () => {
  const { myPickups, activePickup } = useDashboard();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const allList = activePickup
    ? [activePickup, ...myPickups.filter((p) => p.id !== activePickup.id)]
    : myPickups;

  const filtered = allList.filter((p) => {
    if (selectedStatus === 'ALL') return true;
    if (selectedStatus === 'ACTIVE') {
      return p.status !== 'COMPLETED' && p.status !== 'CANCELLED';
    }
    return p.status === selectedStatus;
  });

  const getStatusBadge = (status: PickupStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'ACCEPTED':
      case 'ON_THE_WAY':
      case 'ARRIVED':
      case 'COLLECTING':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div id="my-pickups-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-emerald-600" />
            <span>My Pickups Ledger</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            History of your active assignments and completed scrap pickups.
          </p>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedStatus === st
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <PackageCheck className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No pickups found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Pickups accepted from the queue will be recorded in this operational log.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((pickup) => {
            const totalWeight = pickup.items.reduce(
              (acc, it) => acc + (it.actualWeightKg ?? it.estimatedWeightKg),
              0
            );

            return (
              <div
                key={pickup.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 text-sm">{pickup.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                        pickup.status
                      )}`}
                    >
                      {pickup.status.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {pickup.customerName}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pickup.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pickup.scheduledTime}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{pickup.customerPhone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-bold text-slate-800">
                      {totalWeight} kg
                    </span>
                    {pickup.items.map((it) => (
                      <span
                        key={it.id}
                        className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600"
                      >
                        {it.category}: {it.actualWeightKg ?? it.estimatedWeightKg}kg
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {pickup.status === 'COMPLETED' ? 'Settled Payout' : 'Est. Payout'}
                  </span>
                  <div className="flex items-center gap-1 text-base font-bold text-emerald-700">
                    <IndianRupee className="w-4 h-4" />
                    <span>{pickup.actualPayout || pickup.estimatedPayout}</span>
                  </div>
                  {pickup.completedAt && (
                    <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
