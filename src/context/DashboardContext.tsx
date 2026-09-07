import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  DashboardMetrics,
  PickupRequest,
  PickupStatus,
  WastePassport,
  Transaction,
  CollectorNotification,
} from '../types';
import { collectorApi } from '../api/collectorApi';
import { pickupApi, CompletePickupPayload } from '../api/pickupApi';
import { passportApi } from '../api/passportApi';
import { transactionApi } from '../api/transactionApi';
import { notificationApi } from '../api/notificationApi';
import { locationApi, GeoPosition } from '../api/locationApi';
import { useAuth } from './AuthContext';

interface DashboardContextType {
  metrics: DashboardMetrics | null;
  nearbyPickups: PickupRequest[];
  activePickup: PickupRequest | null;
  myPickups: PickupRequest[];
  passports: WastePassport[];
  transactions: Transaction[];
  notifications: CollectorNotification[];
  unreadNotifCount: number;
  location: GeoPosition | null;
  isLocationLive: boolean;
  isLoadingPickups: boolean;
  isLoadingMetrics: boolean;
  isLoadingActivePickup: boolean;
  errorPickups: string | null;
  errorMetrics: string | null;
  refreshDashboardData: () => Promise<void>;
  acceptPickup: (id: string) => Promise<void>;
  rejectPickup: (id: string) => Promise<void>;
  updatePickupStatus: (id: string, status: PickupStatus) => Promise<void>;
  completePickup: (
    id: string,
    payload: CompletePickupPayload
  ) => Promise<{
    pickup: PickupRequest;
    wastePassportId: string;
    transactionId: string;
  }>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  requestLiveLocation: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, currentCollector } = useAuth();

  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [nearbyPickups, setNearbyPickups] = useState<PickupRequest[]>([]);
  const [activePickup, setActivePickup] = useState<PickupRequest | null>(null);
  const [myPickups, setMyPickups] = useState<PickupRequest[]>([]);
  const [passports, setPassports] = useState<WastePassport[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<CollectorNotification[]>([]);
  const [location, setLocation] = useState<GeoPosition | null>(null);
  const [isLocationLive, setIsLocationLive] = useState<boolean>(false);

  const [isLoadingPickups, setIsLoadingPickups] = useState<boolean>(false);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState<boolean>(false);
  const [isLoadingActivePickup, setIsLoadingActivePickup] = useState<boolean>(false);
  const [errorPickups, setErrorPickups] = useState<string | null>(null);
  const [errorMetrics, setErrorMetrics] = useState<string | null>(null);

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  const requestLiveLocation = useCallback(async () => {
    try {
      const pos = await locationApi.getCurrentPosition();
      setLocation(pos);
      setIsLocationLive(true);
    } catch {
      // Browser location permission denied or unsupported - fall back to zone
      setIsLocationLive(false);
      if (currentCollector?.currentZone) {
        setLocation({
          latitude: 12.9716,
          longitude: 77.5946,
          addressText: currentCollector.currentZone,
          isLive: false,
        });
      } else {
        setLocation(null);
      }
    }
  }, [currentCollector?.currentZone]);

  const loadMetrics = useCallback(async () => {
    if (!isAuthenticated) {
      setMetrics(null);
      return;
    }
    setIsLoadingMetrics(true);
    setErrorMetrics(null);
    try {
      const data = await collectorApi.getDashboardMetrics();
      setMetrics(data);
    } catch (err: any) {
      setErrorMetrics(err?.message || 'Unable to load dashboard metrics');
    } finally {
      setIsLoadingMetrics(false);
    }
  }, [isAuthenticated]);

  const loadActivePickup = useCallback(async () => {
    if (!isAuthenticated) {
      setActivePickup(null);
      return;
    }
    setIsLoadingActivePickup(true);
    try {
      const res = await collectorApi.getActivePickup();
      setActivePickup(res.activePickup);
    } catch {
      setActivePickup(null);
    } finally {
      setIsLoadingActivePickup(false);
    }
  }, [isAuthenticated]);

  const loadNearbyPickups = useCallback(async () => {
    if (!isAuthenticated) {
      setNearbyPickups([]);
      return;
    }
    setIsLoadingPickups(true);
    setErrorPickups(null);
    try {
      const data = await pickupApi.getNearby();
      setNearbyPickups(data);
    } catch (err: any) {
      setErrorPickups(err?.message || 'Unable to load pickup requests');
    } finally {
      setIsLoadingPickups(false);
    }
  }, [isAuthenticated]);

  const loadSecondaryData = useCallback(async () => {
    if (!isAuthenticated) {
      setMyPickups([]);
      setPassports([]);
      setTransactions([]);
      setNotifications([]);
      return;
    }
    try {
      const [pData, wData, tData, nData] = await Promise.all([
        pickupApi.getMyPickups().catch(() => []),
        passportApi.getAll().catch(() => []),
        transactionApi.getAll().catch(() => []),
        notificationApi.getAll().catch(() => []),
      ]);
      setMyPickups(pData);
      setPassports(wData);
      setTransactions(tData);
      setNotifications(nData);
    } catch (err) {
      console.error('Error fetching supporting collections', err);
    }
  }, [isAuthenticated]);

  const refreshDashboardData = useCallback(async () => {
    await Promise.all([
      loadMetrics(),
      loadActivePickup(),
      loadNearbyPickups(),
      loadSecondaryData(),
    ]);
  }, [loadMetrics, loadActivePickup, loadNearbyPickups, loadSecondaryData]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshDashboardData();
      requestLiveLocation();
    } else {
      setMetrics(null);
      setNearbyPickups([]);
      setActivePickup(null);
      setMyPickups([]);
      setPassports([]);
      setTransactions([]);
      setNotifications([]);
      setLocation(null);
      setIsLocationLive(false);
    }
  }, [isAuthenticated, refreshDashboardData, requestLiveLocation]);

  const acceptPickup = async (id: string) => {
    const updated = await pickupApi.accept(id);
    setActivePickup(updated);
    setNearbyPickups((prev) => prev.filter((p) => p.id !== id));
    await refreshDashboardData();
  };

  const rejectPickup = async (id: string) => {
    await pickupApi.reject(id);
    setNearbyPickups((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePickupStatus = async (id: string, status: PickupStatus) => {
    const updated = await pickupApi.updateStatus(id, status);
    setActivePickup(updated);
    await refreshDashboardData();
  };

  const completePickup = async (id: string, payload: CompletePickupPayload) => {
    const res = await pickupApi.complete(id, payload);
    setActivePickup(null);
    await refreshDashboardData();
    return res as any;
  };

  const markNotificationRead = async (id: string) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    await notificationApi.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <DashboardContext.Provider
      value={{
        metrics,
        nearbyPickups,
        activePickup,
        myPickups,
        passports,
        transactions,
        notifications,
        unreadNotifCount,
        location,
        isLocationLive,
        isLoadingPickups,
        isLoadingMetrics,
        isLoadingActivePickup,
        errorPickups,
        errorMetrics,
        refreshDashboardData,
        acceptPickup,
        rejectPickup,
        updatePickupStatus,
        completePickup,
        markNotificationRead,
        markAllNotificationsRead,
        requestLiveLocation,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
