import React, { useState, useEffect } from 'react';
import {
  Scale,
  X,
  IndianRupee,
  CheckCircle2,
  FileCheck2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { WasteCategoryItem } from '../types';

interface CompletePickupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteSuccess?: (passportId: string, txId: string) => void;
}

export const CompletePickupModal: React.FC<CompletePickupModalProps> = ({
  isOpen,
  onClose,
  onCompleteSuccess,
}) => {
  const { activePickup, completePickup } = useDashboard();

  const [items, setItems] = useState<WasteCategoryItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activePickup) {
      setItems(
        activePickup.items.map((it) => ({
          ...it,
          actualWeightKg: it.actualWeightKg ?? it.estimatedWeightKg,
        }))
      );
    }
  }, [activePickup]);

  if (!isOpen || !activePickup) return null;

  const handleWeightChange = (index: number, val: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        actualWeightKg: Math.max(0, val),
      };
      return copy;
    });
  };

  const calculatedPayout = items.reduce(
    (sum, it) => sum + (it.actualWeightKg || 0) * it.ratePerKg,
    0
  );

  const totalActualWeight = items.reduce((sum, it) => sum + (it.actualWeightKg || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await completePickup(activePickup.id, {
        collectedItems: items,
        actualPayout: Math.round(calculatedPayout),
        notes: notes.trim() || undefined,
      });
      onClose();
      if (onCompleteSuccess && res?.wastePassportId) {
        onCompleteSuccess(res.wastePassportId, res.transactionId);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to complete pickup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div
        id="complete-pickup-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Verify Weights & Settle Payout</h3>
              <p className="text-xs text-slate-400">Pickup #{activePickup.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Customer & Location recap */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="flex justify-between font-semibold text-slate-800">
              <span>{activePickup.customerName}</span>
              <span className="text-emerald-700 font-bold">Standard Rate Table</span>
            </div>
            <p className="text-slate-500">{activePickup.address}</p>
          </div>

          {/* Weights table */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Measured Scrap Weights (kg)
            </label>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-900">{item.category}</span>
                    <p className="text-[11px] text-slate-500">
                      Rate: ₹{item.ratePerKg}/kg • Est: {item.estimatedWeightKg}kg
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.actualWeightKg ?? ''}
                        onChange={(e) => handleWeightChange(idx, parseFloat(e.target.value) || 0)}
                        className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-900 text-right focus:outline-emerald-500"
                        required
                      />
                      <span className="ml-1 text-xs font-semibold text-slate-500">kg</span>
                    </div>

                    <div className="w-16 text-right font-bold text-xs text-slate-800">
                      ₹{Math.round((item.actualWeightKg || 0) * item.ratePerKg)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary stats */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-600 block">Total Verified Scrap</span>
              <span className="text-sm font-bold text-slate-900">{totalActualWeight.toFixed(1)} kg</span>
            </div>

            <div className="text-right">
              <span className="text-xs text-emerald-800 block font-medium">Final Payout Amount</span>
              <div className="flex items-center justify-end gap-1 text-lg font-bold text-emerald-700">
                <IndianRupee className="w-4 h-4" />
                <span>{Math.round(calculatedPayout).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              id="confirm-complete-pickup-btn"
              type="submit"
              disabled={isSubmitting || totalActualWeight <= 0}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>Complete & Settle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
