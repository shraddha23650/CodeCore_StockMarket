# Frontend Integration Guide

## ✅ Backend Status: READY FOR FRONTEND

Backend 100% complete hai aur frontend merge ke liye ready hai!

---

## 🔌 API Base URLs

### Development
```
Auth Service:        http://localhost:5000
Products Service:    http://localhost:5001
Receipt Service:     http://localhost:5002
Delivery Service:    http://localhost:5003
Transfer Service:    http://localhost:5004
Adjustment Service:  http://localhost:5005
Dashboard Service:   http://localhost:5006
```

### Production (Docker)
```
Auth Service:        http://localhost:5000
Products Service:    http://localhost:5001
Receipt Service:     http://localhost:5002
Delivery Service:    http://localhost:5003
Transfer Service:    http://localhost:5004
Adjustment Service:  http://localhost:5005
Dashboard Service:   http://localhost:5006
```

---

## 🔐 Authentication

### 1. Register User
```javascript
POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin" // or "staff"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Login
```javascript
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 3. Get Profile
```javascript
GET http://localhost:5000/auth/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "admin",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Profile
```javascript
PUT http://localhost:5000/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

### 5. Change Password
```javascript
PUT http://localhost:5000/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

### 6. Forgot Password (OTP)
```javascript
POST http://localhost:5000/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}

Response:
{
  "success": true,
  "message": "If email exists, OTP has been sent",
  "data": {
    "otp": "123456" // Remove in production
  }
}
```

### 7. Reset Password
```javascript
POST http://localhost:5000/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

---

## 📦 Products API

### Base URL: `http://localhost:5001/products`

### 1. Create Product
```javascript
POST http://localhost:5001/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop",
  "sku": "LAP001",
  "category": "Electronics",
  "quantity": 100,
  "reorderLevel": 10,
  "unit": "pcs",
  "warehouse": "Warehouse A",
  "location": "Rack A"
}
```

### 2. Get All Products
```javascript
GET http://localhost:5001/products?warehouse=Warehouse A&category=Electronics&search=laptop&lowStock=true
Authorization: Bearer <token>
```

### 3. Get Product by ID
```javascript
GET http://localhost:5001/products/:id
Authorization: Bearer <token>
```

### 4. Update Product
```javascript
PUT http://localhost:5001/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Laptop Updated",
  "quantity": 150
}
```

### 5. Delete Product
```javascript
DELETE http://localhost:5001/products/:id
Authorization: Bearer <token>
```

---

## ⚙️ Settings/Master Data API

### Base URL: `http://localhost:5001/settings`

### Warehouses
```javascript
POST   /settings/warehouses          // Create
GET    /settings/warehouses          // Get all
GET    /settings/warehouses/:id       // Get by ID
PUT    /settings/warehouses/:id      // Update (admin only)
DELETE /settings/warehouses/:id      // Delete (admin only)
```

### Categories
```javascript
POST   /settings/categories          // Create
GET    /settings/categories          // Get all
GET    /settings/categories/:id      // Get by ID
PUT    /settings/categories/:id      // Update (admin only)
DELETE /settings/categories/:id      // Delete (admin only)
```

### Locations
```javascript
POST   /settings/locations                    // Create
GET    /settings/locations                    // Get all
GET    /settings/locations/warehouse/:warehouse // Get by warehouse
GET    /settings/locations/:id                // Get by ID
PUT    /settings/locations/:id                // Update (admin only)
DELETE /settings/locations/:id                // Delete (admin only)
```

---

## 📥 Receipts API

### Base URL: `http://localhost:5002/receipt`

### 1. Create Receipt
```javascript
POST http://localhost:5002/receipt
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 50,
  "supplier": "Supplier ABC",
  "warehouse": "Warehouse A",
  "location": "Rack A",
  "status": "draft" // optional, default: draft
}
```

### 2. Get All Receipts
```javascript
GET http://localhost:5002/receipt?warehouse=Warehouse A&status=draft&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### 3. Update Receipt Status
```javascript
PUT http://localhost:5002/receipt/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "done" // draft → waiting → ready → done/canceled
}
```

---

## 📤 Deliveries API

### Base URL: `http://localhost:5003/delivery`

### 1. Create Delivery
```javascript
POST http://localhost:5003/delivery
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 20,
  "deliveredTo": "Customer XYZ",
  "warehouse": "Warehouse A",
  "location": "Rack A",
  "status": "draft" // optional, default: draft
}
```

### 2. Update Delivery Status
```javascript
PUT http://localhost:5003/delivery/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "picking" // draft → waiting → ready → picking → packing → done/canceled
}
```

### 3. Update Picking
```javascript
PUT http://localhost:5003/delivery/:id/picking
Authorization: Bearer <token>
Content-Type: application/json

{
  "pickedQuantity": 18,
  "location": "Rack B"
}
```

### 4. Update Packing
```javascript
PUT http://localhost:5003/delivery/:id/packing
Authorization: Bearer <token>
Content-Type: application/json

{
  "packedQuantity": 18
}
```

---

## 🔄 Transfers API

### Base URL: `http://localhost:5004/transfer`

### 1. Create Transfer
```javascript
POST http://localhost:5004/transfer
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "fromWarehouse": "Warehouse A",
  "toWarehouse": "Warehouse B",
  "fromLocation": "Rack A",
  "toLocation": "Rack C",
  "quantity": 30,
  "status": "draft" // optional, default: draft
}
```

### 2. Update Transfer Status
```javascript
PUT http://localhost:5004/transfer/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "done" // draft → waiting → ready → done/canceled/failed
}
```

---

## 🔧 Adjustments API

### Base URL: `http://localhost:5005/adjustment`

### 1. Create Adjustment
```javascript
POST http://localhost:5005/adjustment
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "newStock": 150,
  "physicalCount": 150, // optional, if provided, newStock = physicalCount
  "adjustmentReason": "Physical count correction",
  "warehouse": "Warehouse A",
  "location": "Rack A",
  "status": "draft" // optional, default: draft
}
```

### 2. Update Adjustment Status
```javascript
PUT http://localhost:5005/adjustment/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "done" // draft → done
}
```

---

## 📊 Dashboard API

### Base URL: `http://localhost:5006/dashboard`

### 1. Get Summary (KPIs)
```javascript
GET http://localhost:5006/dashboard/summary?warehouse=Warehouse A&category=Electronics&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "totalProducts": 100,
    "totalStock": 5000,
    "lowStockItems": 5,
    "outOfStockItems": 2,
    "totalReceived": 1000,
    "totalDelivered": 800,
    "totalTransfers": 50,
    "totalAdjustments": 10,
    "pendingReceipts": 3,
    "pendingDeliveries": 5,
    "pendingTransfers": 2,
    "pendingAdjustments": 1
  }
}
```

### 2. Get Movements (Stock Ledger)
```javascript
GET http://localhost:5006/dashboard/movements?warehouse=Warehouse A&operationType=all&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

---

## 🔑 Authentication Headers

**All protected routes require:**
```
Authorization: Bearer <jwt_token>
```

**Token format:**
- Get token from login/register response
- Store in localStorage/sessionStorage
- Include in all API requests
- Token expires in 7 days (configurable)

---

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 🚨 Error Handling

### Common Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Server Error

### Example Error Response
```json
{
  "success": false,
  "message": "Product not found"
}
```

---

## 🎯 Frontend Integration Checklist

- [ ] Setup API base URLs in config
- [ ] Implement authentication (login, register, logout)
- [ ] Store JWT token (localStorage/sessionStorage)
- [ ] Add token to all API requests (interceptor)
- [ ] Handle token expiration
- [ ] Implement error handling
- [ ] Setup loading states
- [ ] Implement form validation
- [ ] Handle CORS (already configured in backend)

---

## 🔧 Frontend Configuration Example

### React/Vue/Angular Config
```javascript
// config/api.js
export const API_BASE_URLS = {
  AUTH: 'http://localhost:5000',
  PRODUCTS: 'http://localhost:5001',
  RECEIPT: 'http://localhost:5002',
  DELIVERY: 'http://localhost:5003',
  TRANSFER: 'http://localhost:5004',
  ADJUSTMENT: 'http://localhost:5005',
  DASHBOARD: 'http://localhost:5006'
};

// Axios interceptor example
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## ✅ Backend Ready Status

- ✅ All APIs implemented
- ✅ CORS configured (allows all origins - update for production)
- ✅ Authentication working
- ✅ Error handling implemented
- ✅ Status workflows ready
- ✅ Master data APIs ready
- ✅ Dashboard APIs ready

**Backend is 100% ready for frontend integration!** 🚀

---

## 📞 Support

Agar koi issue aaye:
1. Check API base URLs
2. Verify token is included in headers
3. Check CORS configuration
4. Verify MongoDB is running
5. Check service logs

**Happy Coding!** 🎉

