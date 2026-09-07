import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  QrCode,
  Leaf,
  Droplets,
  Zap,
  Building2,
  Calendar,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';
import { WastePassport } from '../../types';

export const WastePassportView: React.FC = () => {
  const { passports } = useDashboard();
  const [selectedPassport, setSelectedPassport] = useState<WastePassport | null>(null);

  const active = selectedPassport || (passports.length > 0 ? passports[0] : null);

  return (
    <div id="waste-passport-view" className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <span>Digital Waste Passports</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-proof verifiable traceability certificates for all recycled scrap materials.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{passports.length} Verified Passports</span>
          </span>
        </div>
      </div>

      {passports.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No waste passports issued yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Completing pickups and verifying material weights automatically generates digital waste passports.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Passport list */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
              Issued Certificates
            </h3>
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {passports.map((wp) => {
                const isSelected = active?.id === wp.id;
                return (
                  <div
                    key={wp.id}
                    onClick={() => setSelectedPassport(wp)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{wp.id}</span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        {wp.totalWeightKg} kg
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1 truncate">{wp.customerName}</p>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                      <span>Pickup #{wp.pickupId}</span>
                      <span>{new Date(wp.dateGenerated).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Passport Detail */}
          {active && (
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Header card */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                      Verified Traceability
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{active.id}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Certificate of Recycling</h2>
                  <p className="text-xs text-slate-500">
                    Sourced from {active.customerName} • Collector: {active.collectorName}
                  </p>
                </div>

                <div className="w-16 h-16 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xs p-1">
                  <QrCode className="w-10 h-10 text-emerald-400" />
                </div>
              </div>

              {/* Environmental Impact metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                  <Leaf className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-500 font-medium block">CO2 Offset</span>
                  <span className="text-base font-bold text-emerald-800">{active.co2OffsetKg} kg</span>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-center">
                  <Droplets className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-500 font-medium block">Water Saved</span>
                  <span className="text-base font-bold text-blue-800">{active.waterSavedLiters} L</span>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100 text-center">
                  <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-[11px] text-slate-500 font-medium block">Energy Saved</span>
                  <span className="text-base font-bold text-amber-800">{active.energySavedKwh} kWh</span>
                </div>
              </div>

              {/* Material Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Material Stream Destination
                </h4>
                <div className="space-y-2">
                  {active.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900">{item.category}</span>
                        <p className="text-[11px] text-slate-500">{item.destinationFacility}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800">{item.weightKg} kg</span>
                        <span className="block text-[10px] text-emerald-700 font-medium">
                          {item.recyclingGrade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Hash Verification */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Audit Verification Hash</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Immutable
                  </span>
                </div>
                <p className="font-mono text-[11px] text-slate-300 break-all">
                  {active.verificationHash}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
