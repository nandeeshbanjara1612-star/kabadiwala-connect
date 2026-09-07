# Kabadiwala Connect - Collector API Specification

This document details the complete REST API interface for the Kabadiwala Connect Collector Dashboard.

---

## Base URL
```
/api
```

All authenticated requests must include the header:
```http
Authorization: Bearer <auth_token>
Content-Type: application/json
```

---

## 1. Authentication Endpoints

### 1.1 Register Collector
- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Description**: Registers a new collector with name, phone, email, vehicle credentials, and cluster zone.
- **Request Body**:
```json
{
  "name": "Arjun Patel",
  "phone": "+91 98450 12345",
  "email": "arjun.patel@email.com",
  "vehicleNumber": "KA-01-MJ-4589",
  "eShramId": "987654321012",
  "currentZone": "Indiranagar Cluster 04"
}
```
- **Response `201 Created`**:
```json
{
  "token": "tok_94a8f...",
  "user": {
    "id": "USR-482a9f1b",
    "name": "Arjun Patel",
    "email": "arjun.patel@email.com",
    "phone": "+91 98450 12345",
    "role": "COLLECTOR",
    "createdAt": "2026-09-01T10:00:00.000Z"
  },
  "collector": {
    "id": "COL-731b8e4c",
    "userId": "USR-482a9f1b",
    "name": "Arjun Patel",
    "phone": "+91 98450 12345",
    "email": "arjun.patel@email.com",
    "eShramId": "987654321012",
    "vehicleNumber": "KA-01-MJ-4589",
    "vehicleType": "Three-Wheeler EV",
    "drivingLicenseNumber": null,
    "availability": "AVAILABLE",
    "trustScore": 98,
    "totalCompletedPickups": 0,
    "totalEarnings": 0,
    "currentZone": "Indiranagar Cluster 04",
    "rating": 4.9,
    "joinedDate": "2026-09-01"
  }
}
```

### 1.2 Login
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Description**: Authenticates collector via registered phone number or email.
- **Request Body**:
```json
{
  "phoneOrEmail": "+91 98450 12345"
}
```
- **Response `200 OK`**:
```json
{
  "token": "tok_94a8f...",
  "user": { "id": "USR-482a9f1b", "name": "Arjun Patel", ... },
  "collector": { "id": "COL-731b8e4c", ... }
}
```

### 1.3 Get Current User (`auth/me`)
- **Method**: `GET`
- **Route**: `/api/auth/me`
- **Description**: Returns currently authenticated user and collector profile.
- **Response `200 OK`**:
```json
{
  "user": {
    "id": "USR-482a9f1b",
    "name": "Arjun Patel",
    "phone": "+91 98450 12345",
    "email": "arjun.patel@email.com",
    "role": "COLLECTOR"
  },
  "collector": {
    "id": "COL-731b8e4c",
    "name": "Arjun Patel",
    "eShramId": "987654321012",
    "vehicleNumber": "KA-01-MJ-4589",
    "availability": "AVAILABLE",
    "trustScore": 98,
    "totalCompletedPickups": 14,
    "totalEarnings": 8420
  }
}
```
- **Error `401 Unauthorized`**:
```json
{ "error": "Session expired or invalid token. Please log in." }
```

### 1.4 Logout
- **Method**: `POST`
- **Route**: `/api/auth/logout`
- **Response `200 OK`**:
```json
{ "success": true, "message": "Logged out successfully" }
```

---

## 2. Collector Endpoints

### 2.1 Get Collector Profile
- **Method**: `GET`
- **Route**: `/api/collectors/me`
- **Response `200 OK`**: `CollectorRecord` object.

### 2.2 Get Collector Dashboard Metrics
- **Method**: `GET`
- **Route**: `/api/collectors/me/dashboard`
- **Response `200 OK`**:
```json
{
  "todaysEarnings": 1450,
  "completedPickupsToday": 2,
  "trustScore": 98,
  "totalPickups": 14,
  "activePickupId": "PK-9042",
  "recentActivity": [
    {
      "id": "ACT-8491",
      "collectorId": "COL-731b8e4c",
      "action": "Completed Pickup #PK-9042",
      "details": "Collected 51 kg scrap. Payout ₹655 settled.",
      "timestamp": "2026-09-01T08:30:00.000Z",
      "type": "pickup"
    }
  ]
}
```

### 2.3 Get Active Pickup
- **Method**: `GET`
- **Route**: `/api/collectors/me/active-pickup`
- **Response `200 OK`**:
```json
{
  "activePickup": {
    "id": "PK-9042",
    "customerId": "CUST-108",
    "customerName": "Customer #108 (Green Residency)",
    "customerPhone": "+91 98401 23456",
    "address": "Flat 402, Green Valley Apartments, 8th Main, Indiranagar",
    "status": "ON_THE_WAY",
    "items": [
      { "id": "WI-1", "category": "Paper", "estimatedWeightKg": 18, "ratePerKg": 14 },
      { "id": "WI-2", "category": "Cardboard", "estimatedWeightKg": 25, "ratePerKg": 11 }
    ],
    "estimatedPayout": 655
  }
}
```
*(If no active pickup: `{"activePickup": null}`)*

### 2.4 Update Availability
- **Method**: `PATCH`
- **Route**: `/api/collectors/me/availability`
- **Request Body**:
```json
{ "availability": "AVAILABLE" }
```
*(Allowed: `AVAILABLE`, `BUSY`, `OFFLINE`)*
- **Response `200 OK`**:
```json
{ "availability": "AVAILABLE" }
```

---

## 3. Pickup Requests Endpoints

### 3.1 Get Nearby Available Pickups
- **Method**: `GET`
- **Route**: `/api/pickups/nearby`
- **Response `200 OK`**:
```json
[
  {
    "id": "PK-9045",
    "customerId": "CUST-214",
    "customerName": "Commercial Office #214 (Apex Tech)",
    "customerPhone": "+91 98405 67890",
    "address": "Plot 45, 100ft Road, Defence Colony, Indiranagar",
    "distanceKm": 2.1,
    "scheduledTime": "Today, 02:00 PM - 03:30 PM",
    "items": [
      { "id": "WI-4", "category": "Cardboard", "estimatedWeightKg": 40, "ratePerKg": 11 },
      { "id": "WI-5", "category": "E-Waste", "estimatedWeightKg": 12, "ratePerKg": 35 }
    ],
    "estimatedPayout": 1280,
    "status": "PENDING"
  }
]
```

### 3.2 Accept Pickup Request
- **Method**: `POST`
- **Route**: `/api/pickups/{pickupId}/accept`
- **Response `200 OK`**:
```json
{
  "id": "PK-9045",
  "status": "ACCEPTED",
  "collectorId": "COL-731b8e4c",
  "acceptedAt": "2026-09-01T10:15:00.000Z"
}
```
- **Error `400 Bad Request`**:
```json
{ "error": "You already have an active pickup in progress." }
```

### 3.3 Reject Pickup Request
- **Method**: `POST`
- **Route**: `/api/pickups/{pickupId}/reject`
- **Response `200 OK`**:
```json
{ "success": true, "id": "PK-9045", "message": "Pickup rejected from your queue" }
```

### 3.4 Update Pickup Status
- **Method**: `PATCH`
- **Route**: `/api/pickups/{pickupId}/status`
- **Request Body**:
```json
{ "status": "ON_THE_WAY" }
```
*(Valid transitions: `ACCEPTED`, `ON_THE_WAY`, `ARRIVED`, `COLLECTING`, `CANCELLED`)*
- **Response `200 OK`**: Updated Pickup record.

### 3.5 Complete Pickup & Settle
- **Method**: `POST`
- **Route**: `/api/pickups/{pickupId}/complete`
- **Request Body**:
```json
{
  "collectedItems": [
    { "id": "WI-4", "category": "Cardboard", "actualWeightKg": 42, "ratePerKg": 11 },
    { "id": "WI-5", "category": "E-Waste", "actualWeightKg": 12, "ratePerKg": 35 }
  ],
  "actualPayout": 882,
  "notes": "Verified on calibrated hanging scale."
}
```
- **Response `200 OK`**:
```json
{
  "pickup": { "id": "PK-9045", "status": "COMPLETED", "actualPayout": 882 },
  "wastePassportId": "WP-8A2F10B3",
  "transactionId": "TXN-98D740E1"
}
```

---

## 4. Waste Passport Endpoints

### 4.1 Get All Issued Passports
- **Method**: `GET`
- **Route**: `/api/passports`
- **Response `200 OK`**: Array of `WastePassport` objects.

### 4.2 Get Passport by ID
- **Method**: `GET`
- **Route**: `/api/passports/{passportId}`
- **Response `200 OK`**:
```json
{
  "id": "WP-8A2F10B3",
  "pickupId": "PK-9045",
  "collectorId": "COL-731b8e4c",
  "collectorName": "Arjun Patel",
  "customerId": "CUST-214",
  "customerName": "Commercial Office #214 (Apex Tech)",
  "dateGenerated": "2026-09-01T10:45:00.000Z",
  "totalWeightKg": 54,
  "co2OffsetKg": 99.9,
  "waterSavedLiters": 1425,
  "energySavedKwh": 183.6,
  "breakdown": [
    {
      "category": "Cardboard",
      "weightKg": 42,
      "destinationFacility": "Kabadiwala Connect Certified MRF #02",
      "recyclingGrade": "Standard Recyclable"
    }
  ],
  "verificationHash": "0x4f828a19de0281b37ec84192bce81938",
  "qrCodeData": "KABADIWALA-CONNECT:PASSPORT:WP-8A2F10B3:WEIGHT:54KG"
}
```

---

## 5. Transactions Endpoints

### 5.1 Get Transactions
- **Method**: `GET`
- **Route**: `/api/transactions`
- **Response `200 OK`**: Array of `Transaction` objects.

---

## 6. Notifications Endpoints

### 6.1 Get Notifications
- **Method**: `GET`
- **Route**: `/api/notifications`
- **Response `200 OK`**: Array of `CollectorNotification` objects.

### 6.2 Mark Notification as Read
- **Method**: `PATCH`
- **Route**: `/api/notifications/{notificationId}/read`
- **Response `200 OK`**:
```json
{ "id": "NT-491a0b", "isRead": true }
```

### 6.3 Mark All as Read
- **Method**: `POST`
- **Route**: `/api/notifications/mark-all-read`
- **Response `200 OK`**:
```json
{ "success": true, "count": 3 }
```
