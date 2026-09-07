import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'COLLECTOR' | 'ADMIN' | 'USER';
  createdAt: string;
}

interface CollectorRecord {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  eShramId: string | null;
  vehicleNumber: string | null;
  vehicleType: string | null;
  drivingLicenseNumber: string | null;
  availability: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  trustScore: number;
  totalCompletedPickups: number;
  totalEarnings: number;
  currentZone: string;
  rating: number;
  joinedDate: string;
}

interface WasteItem {
  id: string;
  category: 'Paper' | 'Cardboard' | 'Plastic' | 'Metal' | 'E-Waste' | 'Glass' | 'Mixed Scrap';
  estimatedWeightKg: number;
  actualWeightKg?: number;
  ratePerKg: number;
}

interface PickupRecord {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  landmark?: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  scheduledTime: string;
  items: WasteItem[];
  estimatedPayout: number;
  actualPayout?: number;
  status: 'PENDING' | 'ASSIGNED' | 'ACCEPTED' | 'ON_THE_WAY' | 'ARRIVED' | 'COLLECTING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  collectorId?: string | null;
  acceptedAt?: string;
  completedAt?: string;
  createdAt: string;
}

interface WastePassportRecord {
  id: string;
  pickupId: string;
  collectorId: string;
  collectorName: string;
  customerId: string;
  customerName: string;
  dateGenerated: string;
  totalWeightKg: number;
  co2OffsetKg: number;
  waterSavedLiters: number;
  energySavedKwh: number;
  breakdown: {
    category: string;
    weightKg: number;
    destinationFacility: string;
    recyclingGrade: string;
  }[];
  verificationHash: string;
  qrCodeData: string;
}

interface TransactionRecord {
  id: string;
  pickupId: string;
  collectorId: string;
  customerId: string;
  amount: number;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  paymentMode: 'DIRECT_UPI' | 'BANK_TRANSFER' | 'CASH';
  timestamp: string;
  referenceId: string;
  description: string;
  materialsSummary: string;
}

interface NotificationRecord {
  id: string;
  collectorId: string;
  title: string;
  message: string;
  type: 'PICKUP_NEW' | 'PICKUP_STATUS' | 'PAYMENT' | 'TRUST_SCORE' | 'SYSTEM';
  isRead: boolean;
  relatedEntityId?: string;
  createdAt: string;
}

interface ActivityRecord {
  id: string;
  collectorId: string;
  action: string;
  details: string;
  timestamp: string;
  type: 'pickup' | 'earnings' | 'status' | 'passport';
}

// In-Memory Database Store
const users: Map<string, UserRecord> = new Map();
const collectors: Map<string, CollectorRecord> = new Map();
const tokens: Map<string, string> = new Map(); // token -> userId
const pickups: Map<string, PickupRecord> = new Map();
const passports: Map<string, WastePassportRecord> = new Map();
const transactions: Map<string, TransactionRecord> = new Map();
const notifications: Map<string, NotificationRecord> = new Map();
const activities: Map<string, ActivityRecord> = new Map();

// Helper to seed initial available nearby requests without fake personal names
function seedInitialPickupRequests() {
  const samplePickups: PickupRecord[] = [
    {
      id: 'PK-9042',
      customerId: 'CUST-108',
      customerName: 'Customer #108 (Green Residency)',
      customerPhone: '+91 98401 23456',
      address: 'Flat 402, Green Valley Apartments, 8th Main, Indiranagar',
      landmark: 'Near BDA Complex',
      latitude: 12.9784,
      longitude: 77.6408,
      distanceKm: 1.4,
      scheduledTime: 'Today, 10:30 AM - 11:30 AM',
      items: [
        { id: 'WI-1', category: 'Paper', estimatedWeightKg: 18, ratePerKg: 14 },
        { id: 'WI-2', category: 'Cardboard', estimatedWeightKg: 25, ratePerKg: 11 },
        { id: 'WI-3', category: 'Plastic', estimatedWeightKg: 8, ratePerKg: 16 },
      ],
      estimatedPayout: 655,
      status: 'PENDING',
      notes: 'Segregated waste kept near parking lot gate B.',
      collectorId: null,
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    },
    {
      id: 'PK-9045',
      customerId: 'CUST-214',
      customerName: 'Commercial Office #214 (Apex Tech)',
      customerPhone: '+91 98405 67890',
      address: 'Plot 45, 100ft Road, Defence Colony, Indiranagar',
      landmark: 'Opposite Metro Station Pillar 140',
      latitude: 12.9719,
      longitude: 77.6412,
      distanceKm: 2.1,
      scheduledTime: 'Today, 02:00 PM - 03:30 PM',
      items: [
        { id: 'WI-4', category: 'Cardboard', estimatedWeightKg: 40, ratePerKg: 11 },
        { id: 'WI-5', category: 'E-Waste', estimatedWeightKg: 12, ratePerKg: 35 },
        { id: 'WI-6', category: 'Metal', estimatedWeightKg: 15, ratePerKg: 28 },
      ],
      estimatedPayout: 1280,
      status: 'PENDING',
      notes: 'Office cardboard boxes & retired PC parts. Building loading dock available.',
      collectorId: null,
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    },
    {
      id: 'PK-9049',
      customerId: 'CUST-302',
      customerName: 'Resident #302 (Sunrise Villas)',
      customerPhone: '+91 98407 11223',
      address: 'Villa 18, 5th Cross, HAL 2nd Stage',
      landmark: 'Near Leela Palace Gate',
      latitude: 12.9602,
      longitude: 77.6485,
      distanceKm: 3.2,
      scheduledTime: 'Today, 04:00 PM - 05:00 PM',
      items: [
        { id: 'WI-7', category: 'Plastic', estimatedWeightKg: 14, ratePerKg: 16 },
        { id: 'WI-8', category: 'Glass', estimatedWeightKg: 22, ratePerKg: 4 },
        { id: 'WI-9', category: 'Paper', estimatedWeightKg: 10, ratePerKg: 14 },
      ],
      estimatedPayout: 452,
      status: 'PENDING',
      notes: 'Glass bottles packed safely in crates.',
      collectorId: null,
      createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    },
  ];

  samplePickups.forEach(p => pickups.set(p.id, p));
}

seedInitialPickupRequests();

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const userId = tokens.get(token);

  if (!userId || !users.has(userId)) {
    return res.status(401).json({ error: 'Session expired or invalid token. Please log in.' });
  }

  (req as any).userId = userId;
  (req as any).user = users.get(userId);
  (req as any).collector = collectors.get(userId);
  next();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ==========================================
  // AUTHENTICATION ENDPOINTS
  // ==========================================

  // POST /api/auth/register
  app.post('/api/auth/register', (req, res) => {
    const { name, email, phone, vehicleNumber, vehicleType, eShramId, drivingLicenseNumber, currentZone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const userId = 'USR-' + crypto.randomUUID().slice(0, 8);
    const collectorId = 'COL-' + crypto.randomUUID().slice(0, 8);

    const user: UserRecord = {
      id: userId,
      name: name.trim(),
      email: email ? email.trim() : `${phone.replace(/\D/g, '')}@kabadiwalaconnect.in`,
      phone: phone.trim(),
      role: 'COLLECTOR',
      createdAt: new Date().toISOString(),
    };

    const collector: CollectorRecord = {
      id: collectorId,
      userId: userId,
      name: user.name,
      phone: user.phone,
      email: user.email,
      eShramId: eShramId ? eShramId.trim() : null,
      vehicleNumber: vehicleNumber ? vehicleNumber.trim() : null,
      vehicleType: vehicleType ? vehicleType.trim() : 'Three-Wheeler EV',
      drivingLicenseNumber: drivingLicenseNumber ? drivingLicenseNumber.trim() : null,
      availability: 'AVAILABLE',
      trustScore: 98,
      totalCompletedPickups: 0,
      totalEarnings: 0,
      currentZone: currentZone || 'Indiranagar Cluster 04',
      rating: 4.9,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    users.set(userId, user);
    collectors.set(userId, collector);

    const token = 'tok_' + crypto.randomBytes(24).toString('hex');
    tokens.set(token, userId);

    // Initial system notification
    const notifId = 'NT-' + crypto.randomUUID().slice(0, 8);
    notifications.set(notifId, {
      id: notifId,
      collectorId: collector.id,
      title: 'Welcome to Kabadiwala Connect',
      message: `Account activated for ${user.name}. You are now set to AVAILABLE and ready to accept verified pickups.`,
      type: 'SYSTEM',
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    const actId = 'ACT-' + crypto.randomUUID().slice(0, 8);
    activities.set(actId, {
      id: actId,
      collectorId: collector.id,
      action: 'Account Activated',
      details: 'Registered and verified collector credentials.',
      timestamp: new Date().toISOString(),
      type: 'status',
    });

    return res.status(201).json({
      token,
      user,
      collector,
    });
  });

  // POST /api/auth/login
  app.post('/api/auth/login', (req, res) => {
    const { phoneOrEmail } = req.body;

    if (!phoneOrEmail || !phoneOrEmail.trim()) {
      return res.status(400).json({ error: 'Phone number or email is required' });
    }

    const searchKey = phoneOrEmail.trim().toLowerCase();

    // Look for existing user
    let matchedUser: UserRecord | undefined;
    for (const u of users.values()) {
      if (u.phone.toLowerCase() === searchKey || u.email.toLowerCase() === searchKey || u.name.toLowerCase() === searchKey) {
        matchedUser = u;
        break;
      }
    }

    if (!matchedUser) {
      // If user not found, create registered collector session cleanly with the provided identifier
      const userId = 'USR-' + crypto.randomUUID().slice(0, 8);
      const collectorId = 'COL-' + crypto.randomUUID().slice(0, 8);
      
      const isEmail = searchKey.includes('@');
      const cleanName = isEmail ? searchKey.split('@')[0] : `Collector (${searchKey.slice(-4)})`;

      matchedUser = {
        id: userId,
        name: cleanName,
        email: isEmail ? searchKey : `${searchKey.replace(/\D/g, '')}@kabadiwalaconnect.in`,
        phone: !isEmail ? searchKey : '+91 90000 00000',
        role: 'COLLECTOR',
        createdAt: new Date().toISOString(),
      };

      const newCollector: CollectorRecord = {
        id: collectorId,
        userId: userId,
        name: matchedUser.name,
        phone: matchedUser.phone,
        email: matchedUser.email,
        eShramId: null,
        vehicleNumber: null,
        vehicleType: 'Three-Wheeler EV',
        drivingLicenseNumber: null,
        availability: 'AVAILABLE',
        trustScore: 98,
        totalCompletedPickups: 0,
        totalEarnings: 0,
        currentZone: 'Indiranagar Cluster 04',
        rating: 4.9,
        joinedDate: new Date().toISOString().split('T')[0],
      };

      users.set(userId, matchedUser);
      collectors.set(userId, newCollector);
    }

    const collector = collectors.get(matchedUser.id);
    const token = 'tok_' + crypto.randomBytes(24).toString('hex');
    tokens.set(token, matchedUser.id);

    return res.json({
      token,
      user: matchedUser,
      collector,
    });
  });

  // GET /api/auth/me
  app.get('/api/auth/me', authMiddleware, (req, res) => {
    const user = (req as any).user;
    const collector = (req as any).collector;

    return res.json({
      user,
      collector,
    });
  });

  // POST /api/auth/logout
  app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      tokens.delete(token);
    }
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // ==========================================
  // COLLECTOR ENDPOINTS
  // ==========================================

  // GET /api/collectors/me
  app.get('/api/collectors/me', authMiddleware, (req, res) => {
    const collector = (req as any).collector;
    return res.json(collector);
  });

  // PATCH /api/collectors/me
  app.patch('/api/collectors/me', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    const updates = req.body;

    const allowedFields: (keyof CollectorRecord)[] = [
      'name', 'phone', 'email', 'eShramId', 'vehicleNumber', 'vehicleType',
      'drivingLicenseNumber', 'currentZone', 'availability'
    ];

    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        (collector as any)[field] = updates[field];
      }
    });

    if (updates.name) {
      const user = users.get(collector.userId);
      if (user) {
        user.name = updates.name;
      }
    }

    collectors.set(collector.userId, collector);
    return res.json(collector);
  });

  // GET /api/collectors/me/dashboard
  app.get('/api/collectors/me/dashboard', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;

    // Calculate real stats for this collector today
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    let todaysEarnings = 0;
    let completedPickupsToday = 0;

    for (const tx of transactions.values()) {
      if (tx.collectorId === collector.id && tx.status === 'SUCCESS' && tx.timestamp >= startOfToday) {
        todaysEarnings += tx.amount;
      }
    }

    for (const p of pickups.values()) {
      if (p.collectorId === collector.id && p.status === 'COMPLETED' && p.completedAt && p.completedAt >= startOfToday) {
        completedPickupsToday += 1;
      }
    }

    // Active pickup if any
    let activePickupId: string | null = null;
    for (const p of pickups.values()) {
      if (p.collectorId === collector.id && p.status !== 'COMPLETED' && p.status !== 'CANCELLED') {
        activePickupId = p.id;
        break;
      }
    }

    // Collector activity logs
    const collectorActivities: ActivityRecord[] = [];
    for (const act of activities.values()) {
      if (act.collectorId === collector.id) {
        collectorActivities.push(act);
      }
    }
    collectorActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return res.json({
      todaysEarnings: todaysEarnings || collector.totalEarnings || 0,
      completedPickupsToday: completedPickupsToday || collector.totalCompletedPickups || 0,
      trustScore: collector.trustScore ?? null,
      totalPickups: collector.totalCompletedPickups || 0,
      activePickupId,
      recentActivity: collectorActivities.slice(0, 10),
    });
  });

  // GET /api/collectors/me/active-pickup
  app.get('/api/collectors/me/active-pickup', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;

    let activePickup: PickupRecord | null = null;
    for (const p of pickups.values()) {
      if (p.collectorId === collector.id && p.status !== 'COMPLETED' && p.status !== 'CANCELLED') {
        activePickup = p;
        break;
      }
    }

    return res.json({ activePickup });
  });

  // PATCH /api/collectors/me/availability
  app.patch('/api/collectors/me/availability', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    const { availability } = req.body;

    if (!['AVAILABLE', 'BUSY', 'OFFLINE'].includes(availability)) {
      return res.status(400).json({ error: 'Invalid availability status. Must be AVAILABLE, BUSY, or OFFLINE.' });
    }

    collector.availability = availability;
    collectors.set(collector.userId, collector);

    const actId = 'ACT-' + crypto.randomUUID().slice(0, 8);
    activities.set(actId, {
      id: actId,
      collectorId: collector.id,
      action: 'Availability Status Updated',
      details: `Status set to ${availability}`,
      timestamp: new Date().toISOString(),
      type: 'status',
    });

    return res.json({ availability: collector.availability });
  });

  // ==========================================
  // PICKUPS ENDPOINTS
  // ==========================================

  // GET /api/pickups/nearby
  app.get('/api/pickups/nearby', authMiddleware, (req, res) => {
    const availablePickups: PickupRecord[] = [];
    for (const p of pickups.values()) {
      if (p.status === 'PENDING' && !p.collectorId) {
        availablePickups.push(p);
      }
    }

    availablePickups.sort((a, b) => a.distanceKm - b.distanceKm);
    return res.json(availablePickups);
  });

  // GET /api/pickups/my
  app.get('/api/pickups/my', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    const { status } = req.query;

    const myPickups: PickupRecord[] = [];
    for (const p of pickups.values()) {
      if (p.collectorId === collector.id) {
        if (!status || p.status === status) {
          myPickups.push(p);
        }
      }
    }

    myPickups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(myPickups);
  });

  // GET /api/pickups/:id
  app.get('/api/pickups/:id', authMiddleware, (req, res) => {
    const pickup = pickups.get(req.params.id);
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup request not found' });
    }
    return res.json(pickup);
  });

  // POST /api/pickups/:id/accept
  app.post('/api/pickups/:id/accept', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    const pickup = pickups.get(req.params.id);

    if (!pickup) {
      return res.status(404).json({ error: 'Pickup request not found' });
    }

    // Check if collector already has an ongoing active pickup
    for (const p of pickups.values()) {
      if (p.collectorId === collector.id && p.status !== 'COMPLETED' && p.status !== 'CANCELLED' && p.id !== pickup.id) {
        return res.status(400).json({
          error: `You already have an active pickup #${p.id} in progress. Complete or cancel it before accepting a new request.`,
        });
      }
    }

    if (pickup.status !== 'PENDING' && pickup.collectorId !== collector.id) {
      return res.status(400).json({ error: 'This pickup request is no longer available or was accepted by another collector.' });
    }

    pickup.collectorId = collector.id;
    pickup.status = 'ACCEPTED';
    pickup.acceptedAt = new Date().toISOString();
    pickups.set(pickup.id, pickup);

    // Activity Log
    const actId = 'ACT-' + crypto.randomUUID().slice(0, 8);
    activities.set(actId, {
      id: actId,
      collectorId: collector.id,
      action: `Accepted Pickup #${pickup.id}`,
      details: `Scheduled at ${pickup.address} (Est. Payout ₹${pickup.estimatedPayout})`,
      timestamp: new Date().toISOString(),
      type: 'pickup',
    });

    // Notification
    const notifId = 'NT-' + crypto.randomUUID().slice(0, 8);
    notifications.set(notifId, {
      id: notifId,
      collectorId: collector.id,
      title: `Pickup #${pickup.id} Assigned`,
      message: `You accepted pickup for ${pickup.customerName}. Head over to ${pickup.address} when ready.`,
      type: 'PICKUP_STATUS',
      isRead: false,
      relatedEntityId: pickup.id,
      createdAt: new Date().toISOString(),
    });

    return res.json(pickup);
  });

  // POST /api/pickups/:id/reject
  app.post('/api/pickups/:id/reject', authMiddleware, (req, res) => {
    const pickup = pickups.get(req.params.id);
    if (!pickup) {
      return res.status(404).json({ error: 'Pickup request not found' });
    }

    // Rejecting simply keeps backend record, but unties collector if assigned or remains available for other collectors
    if (pickup.status === 'ACCEPTED' || pickup.status === 'ASSIGNED') {
      pickup.collectorId = null;
      pickup.status = 'PENDING';
      pickups.set(pickup.id, pickup);
    }

    return res.json({ success: true, id: pickup.id, message: 'Pickup rejected from your queue' });
  });

  // PATCH /api/pickups/:id/status
  app.patch('/api/pickups/:id/status', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    const pickup = pickups.get(req.params.id);
    const { status } = req.body;

    if (!pickup) {
      return res.status(404).json({ error: 'Pickup request not found' });
    }

    if (pickup.collectorId !== collector.id) {
      return res.status(403).json({ error: 'You are not assigned to this pickup request' });
    }

    const validTransitions = ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'COLLECTING', 'CANCELLED'];
    if (!validTransitions.includes(status)) {
      return res.status(400).json({ error: `Invalid status transition: ${status}` });
    }

    pickup.status = status;
    pickups.set(pickup.id, pickup);

    const actId = 'ACT-' + crypto.randomUUID().slice(0, 8);
    activities.set(actId, {
      id: actId,
      collectorId: collector.id,
      action: `Pickup #${pickup.id} status: ${status.replace(/_/g, ' ')}`,
      details: `Updated on-field status for customer location`,
      timestamp: new Date().toISOString(),
      type: 'status',
    });

    return res.json(pickup);
  });

  // POST /api/pickups/:id/complete
  app.post('/api/pickups/:id/complete', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    const pickup = pickups.get(req.params.id);
    const { collectedItems, actualPayout, notes } = req.body;

    if (!pickup) {
      return res.status(404).json({ error: 'Pickup request not found' });
    }

    if (pickup.collectorId !== collector.id) {
      return res.status(403).json({ error: 'You are not assigned to this pickup request' });
    }

    const finalItems: WasteItem[] = (collectedItems && collectedItems.length > 0) ? collectedItems : pickup.items;
    const totalWeight = finalItems.reduce((acc, it) => acc + (it.actualWeightKg || it.estimatedWeightKg || 0), 0);
    const finalPayout = actualPayout !== undefined ? Number(actualPayout) : pickup.estimatedPayout;

    // Update Pickup
    pickup.status = 'COMPLETED';
    pickup.items = finalItems;
    pickup.actualPayout = finalPayout;
    pickup.completedAt = new Date().toISOString();
    if (notes) pickup.notes = notes;
    pickups.set(pickup.id, pickup);

    // Update Collector stats
    collector.totalCompletedPickups = (collector.totalCompletedPickups || 0) + 1;
    collector.totalEarnings = (collector.totalEarnings || 0) + finalPayout;
    collector.trustScore = Math.min(100, Math.round(98 + (collector.totalCompletedPickups * 0.2)));
    collectors.set(collector.userId, collector);

    // Generate Waste Passport
    const passportId = 'WP-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    const passport: WastePassportRecord = {
      id: passportId,
      pickupId: pickup.id,
      collectorId: collector.id,
      collectorName: collector.name,
      customerId: pickup.customerId,
      customerName: pickup.customerName,
      dateGenerated: new Date().toISOString(),
      totalWeightKg: totalWeight,
      co2OffsetKg: Number((totalWeight * 1.85).toFixed(2)),
      waterSavedLiters: Math.round(totalWeight * 26.4),
      energySavedKwh: Number((totalWeight * 3.4).toFixed(1)),
      breakdown: finalItems.map(item => ({
        category: item.category,
        weightKg: item.actualWeightKg || item.estimatedWeightKg,
        destinationFacility: 'Kabadiwala Connect Certified Material Recovery Facility #02',
        recyclingGrade: item.category === 'Plastic' ? 'Grade A (PET/HDPE)' : item.category === 'Metal' ? 'High Purity' : 'Standard Recyclable',
      })),
      verificationHash: '0x' + crypto.createHash('sha256').update(pickup.id + collector.id + Date.now()).digest('hex').slice(0, 32),
      qrCodeData: `KABADIWALA-CONNECT:PASSPORT:${passportId}:WEIGHT:${totalWeight}KG`,
    };
    passports.set(passportId, passport);

    // Generate Transaction Record
    const txId = 'TXN-' + crypto.randomUUID().slice(0, 8).toUpperCase();
    const materialsSummary = finalItems.map(i => `${i.category}: ${i.actualWeightKg || i.estimatedWeightKg}kg`).join(', ');
    const transaction: TransactionRecord = {
      id: txId,
      pickupId: pickup.id,
      collectorId: collector.id,
      customerId: pickup.customerId,
      amount: finalPayout,
      status: 'SUCCESS',
      paymentMode: 'DIRECT_UPI',
      timestamp: new Date().toISOString(),
      referenceId: 'UPI-' + crypto.randomUUID().slice(0, 10).toUpperCase(),
      description: `Settlement for Pickup #${pickup.id}`,
      materialsSummary,
    };
    transactions.set(txId, transaction);

    // Notification
    const notifId = 'NT-' + crypto.randomUUID().slice(0, 8);
    notifications.set(notifId, {
      id: notifId,
      collectorId: collector.id,
      title: `Pickup #${pickup.id} Completed & Paid`,
      message: `₹${finalPayout} credited to your UPI account. Waste Passport #${passportId} generated for ${totalWeight} kg scrap.`,
      type: 'PAYMENT',
      isRead: false,
      relatedEntityId: txId,
      createdAt: new Date().toISOString(),
    });

    // Activity Log
    const actId = 'ACT-' + crypto.randomUUID().slice(0, 8);
    activities.set(actId, {
      id: actId,
      collectorId: collector.id,
      action: `Completed Pickup #${pickup.id}`,
      details: `Collected ${totalWeight} kg scrap. Payout ₹${finalPayout} settled. Passport #${passportId}`,
      timestamp: new Date().toISOString(),
      type: 'pickup',
    });

    return res.json({
      pickup,
      wastePassportId: passportId,
      transactionId: txId,
    });
  });

  // ==========================================
  // WASTE PASSPORT ENDPOINTS
  // ==========================================

  // GET /api/passports
  app.get('/api/passports', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    const userPassports: WastePassportRecord[] = [];

    for (const p of passports.values()) {
      if (p.collectorId === collector.id) {
        userPassports.push(p);
      }
    }

    userPassports.sort((a, b) => new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime());
    return res.json(userPassports);
  });

  // GET /api/passports/:id
  app.get('/api/passports/:id', authMiddleware, (req, res) => {
    const passport = passports.get(req.params.id);
    if (!passport) {
      return res.status(404).json({ error: 'Waste Passport not found' });
    }
    return res.json(passport);
  });

  // ==========================================
  // TRANSACTIONS ENDPOINTS
  // ==========================================

  // GET /api/transactions
  app.get('/api/transactions', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    const collectorTransactions: TransactionRecord[] = [];

    for (const tx of transactions.values()) {
      if (tx.collectorId === collector.id) {
        collectorTransactions.push(tx);
      }
    }

    collectorTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return res.json(collectorTransactions);
  });

  // GET /api/transactions/:id
  app.get('/api/transactions/:id', authMiddleware, (req, res) => {
    const tx = transactions.get(req.params.id);
    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    return res.json(tx);
  });

  // ==========================================
  // NOTIFICATIONS ENDPOINTS
  // ==========================================

  // GET /api/notifications
  app.get('/api/notifications', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    const collectorNotifs: NotificationRecord[] = [];

    for (const n of notifications.values()) {
      if (n.collectorId === collector.id) {
        collectorNotifs.push(n);
      }
    }

    collectorNotifs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return res.json(collectorNotifs);
  });

  // PATCH /api/notifications/:id/read
  app.patch('/api/notifications/:id/read', authMiddleware, (req, res) => {
    const notif = notifications.get(req.params.id);
    if (!notif) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notif.isRead = true;
    notifications.set(notif.id, notif);
    return res.json({ id: notif.id, isRead: true });
  });

  // POST /api/notifications/mark-all-read
  app.post('/api/notifications/mark-all-read', authMiddleware, (req, res) => {
    const collector = (req as any).collector as CollectorRecord;
    let count = 0;

    for (const n of notifications.values()) {
      if (n.collectorId === collector.id && !n.isRead) {
        n.isRead = true;
        notifications.set(n.id, n);
        count++;
      }
    }

    return res.json({ success: true, count });
  });

  // Vite Middleware & Static Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kabadiwala Connect Server running on http://localhost:${PORT}`);
  });
}

startServer();
