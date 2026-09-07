import React, { useState } from 'react';
import {
  UserCheck,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  FileText,
  MapPin,
  Star,
  Award,
  Edit2,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfileView: React.FC = () => {
  const { currentCollector, currentUser, isAuthenticated, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentCollector?.name || '');
  const [phone, setPhone] = useState(currentCollector?.phone || '');
  const [email, setEmail] = useState(currentCollector?.email || '');
  const [eShramId, setEShramId] = useState(currentCollector?.eShramId || '');
  const [vehicleNumber, setVehicleNumber] = useState(currentCollector?.vehicleNumber || '');
  const [vehicleType, setVehicleType] = useState(currentCollector?.vehicleType || '');
  const [currentZone, setCurrentZone] = useState(currentCollector?.currentZone || '');

  const [isSaving, setIsSaving] = useState(false);

  if (!isAuthenticated || !currentCollector) {
    return (
      <div id="profile-view-unauth" className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <UserCheck className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">No collector profile loaded</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Please sign in to view and manage your authenticated collector profile and verification documents.
        </p>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        eShramId: eShramId.trim() || null,
        vehicleNumber: vehicleNumber.trim() || null,
        vehicleType: vehicleType.trim() || null,
        currentZone: currentZone.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div id="profile-view" className="space-y-6 max-w-4xl">
      {/* Header Profile Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-bold uppercase shadow-sm">
            {currentUser?.name?.charAt(0) || 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentCollector.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Verified Collector
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Collector ID: {currentCollector.id} • Joined: {currentCollector.joinedDate}
            </p>
          </div>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => {
                setName(currentCollector.name);
                setPhone(currentCollector.phone);
                setEmail(currentCollector.email);
                setEShramId(currentCollector.eShramId || '');
                setVehicleNumber(currentCollector.vehicleNumber || '');
                setVehicleType(currentCollector.vehicleType || '');
                setCurrentZone(currentCollector.currentZone || '');
                setIsEditing(true);
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b pb-3">Edit Collector Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Operational Zone</label>
              <input
                type="text"
                value={currentZone}
                onChange={(e) => setCurrentZone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">e-Shram ID</label>
              <input
                type="text"
                placeholder="Not available"
                value={eShramId}
                onChange={(e) => setEShramId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Vehicle Number</label>
              <input
                type="text"
                placeholder="Not available"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs"
              />
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg border text-xs font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal & Contact info */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Identity & Registration</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Legal Name</span>
                <span className="font-semibold text-slate-900">{currentCollector.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Phone</span>
                <span className="font-semibold text-slate-900">{currentCollector.phone}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-900">{currentCollector.email}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">e-Shram ID</span>
                <span className="font-semibold text-slate-900">
                  {currentCollector.eShramId || 'Not available'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Operational Zone</span>
                <span className="font-semibold text-slate-900">
                  {currentCollector.currentZone || 'Not available'}
                </span>
              </div>
            </div>
          </div>

          {/* Vehicle & Operational Credentials */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-3">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Vehicle & Logistics</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Vehicle Number</span>
                <span className="font-semibold text-slate-900">
                  {currentCollector.vehicleNumber || 'Not available'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Vehicle Type</span>
                <span className="font-semibold text-slate-900">
                  {currentCollector.vehicleType || 'Not available'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Driving License</span>
                <span className="font-semibold text-slate-900">
                  {currentCollector.drivingLicenseNumber || 'Not available'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Trust Score</span>
                <span className="font-bold text-emerald-700">
                  {currentCollector.trustScore ? `${currentCollector.trustScore}%` : '—'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Availability</span>
                <span className="font-semibold text-slate-900 capitalize">
                  {currentCollector.availability.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
