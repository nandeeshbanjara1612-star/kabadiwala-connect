import React, { useState } from 'react';
import { LogIn, UserPlus, X, Loader2, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [eShramId, setEShramId] = useState('');
  const [currentZone, setCurrentZone] = useState('Indiranagar Cluster 04');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail.trim()) {
      setError('Please enter your phone number or email.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await login({ phoneOrEmail: phoneOrEmail.trim() });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Full name and phone number are required.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await register({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        vehicleNumber: vehicleNumber.trim() || undefined,
        eShramId: eShramId.trim() || undefined,
        currentZone: currentZone.trim(),
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
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
        id="auth-modal"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                {mode === 'login' ? 'Collector Sign In' : 'Register New Collector'}
              </h3>
              <p className="text-xs text-slate-400">Kabadiwala Connect Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-semibold text-center transition-colors border-b-2 ${
              mode === 'register'
                ? 'border-emerald-600 text-emerald-700 bg-emerald-50/40'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Phone Number or Email</label>
                <input
                  id="login-identifier-input"
                  type="text"
                  placeholder="e.g. +91 98765 43210 or your email"
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-emerald-500 focus:border-emerald-500"
                  required
                />
                <p className="text-[11px] text-slate-400">
                  Enter your registered phone or email to load your authenticated profile and dashboard.
                </p>
              </div>

              <button
                id="submit-login-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                <span>Sign In to Dashboard</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Full Name *</label>
                <input
                  id="reg-name-input"
                  type="text"
                  placeholder="Your legal name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                  <input
                    id="reg-phone-input"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-emerald-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Email Address</label>
                  <input
                    id="reg-email-input"
                    type="email"
                    placeholder="name@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Vehicle Number</label>
                  <input
                    id="reg-vehicle-input"
                    type="text"
                    placeholder="KA-01-AB-1234"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">e-Shram ID</label>
                  <input
                    id="reg-eshram-input"
                    type="text"
                    placeholder="UAN 12-digit"
                    value={eShramId}
                    onChange={(e) => setEShramId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Operational Cluster / Zone</label>
                <input
                  id="reg-zone-input"
                  type="text"
                  value={currentZone}
                  onChange={(e) => setCurrentZone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-emerald-500"
                />
              </div>

              <button
                id="submit-register-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>Register & Open Dashboard</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
