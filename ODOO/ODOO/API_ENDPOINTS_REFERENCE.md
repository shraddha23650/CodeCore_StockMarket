# Complete API Endpoints Reference

## Quick Reference for Frontend Developers

---

## 🔐 Authentication Service (Port 5000)

| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| POST | `/auth/register` | ❌ | - |
| POST | `/auth/login` | ❌ | - |
| GET | `/auth/profile` | ✅ | - |
| PUT | `/auth/profile` | ✅ | - |
| PUT | `/auth/change-password` | ✅ | - |
| POST | `/auth/forgot-password` | ❌ | - |
| POST | `/auth/reset-password` | ❌ | - |

---

## 📦 Products Service (Port 5001)

### Products
| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| POST | `/products` | ✅ | admin, staff |
| GET | `/products` | ✅ | - |
| GET | `/products/:id` | ✅ | - |
| PUT | `/products/:id` | ✅ | admin, staff |
| DELETE | `/products/:id` | ✅ | admin |

### Settings (Master Data)
| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| POST | `/settings/warehouses` | ✅ | admin, staff |
| GET | `/settings/warehouses` | ✅ | - |
| GET | `/settings/warehouses/:id` | ✅ | - |
| PUT | `/settings/warehouses/:id` | ✅ | admin |
| DELETE | `/settings/warehouses/:id` | ✅ | admin |
| POST | `/settings/categories` | ✅ | admin, staff |
| GET | `/settings/categories` | ✅ | - |
| GET | `/settings/categories/:id` | ✅ | - |
| PUT | `/settings/categories/:id` | ✅ | admin |
| DELETE | `/settings/categories/:id` | ✅ | admin |
| POST | `/settings/locations` | ✅ | admin, staff |
| GET | `/settings/locations` | ✅ | - |
| GET | `/settings/locations/warehouse/:warehouse` | ✅ | - |
| GET | `/settings/locations/:id` | ✅ | - |
| PUT | `/settings/locations/:id` | ✅ | admin |
| DELETE | `/settings/locations/:id` | ✅ | admin |

---

## 📥 Receipts Service (Port 5002)

| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| POST | `/receipt` | ✅ | admin, staff |
| GET | `/receipt` | ✅ | - |
| GET | `/receipt/:id` | ✅ | - |
| PUT | `/receipt/:id/status` | ✅ | admin, staff |

**Status Flow:** `draft` → `waiting` → `ready` → `done` / `canceled`

---

## 📤 Deliveries Service (Port 5003)

| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| POST | `/delivery` | ✅ | admin, staff |
| GET | `/delivery` | ✅ | - |
| GET | `/delivery/:id` | ✅ | - |
| PUT | `/delivery/:id/status` | ✅ | admin, staff |
| PUT | `/delivery/:id/picking` | ✅ | admin, staff |
| PUT | `/delivery/:id/packing` | ✅ | admin, staff |

**Status Flow:** `draft` → `waiting` → `ready` → `picking` → `packing` → `done` / `canceled`

---

## 🔄 Transfers Service (Port 5004)

| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| POST | `/transfer` | ✅ | admin, staff |
| GET | `/transfer` | ✅ | - |
| GET | `/transfer/:id` | ✅ | - |
| PUT | `/transfer/:id/status` | ✅ | admin, staff |

**Status Flow:** `draft` → `waiting` → `ready` → `done` / `canceled` / `failed`

---

## 🔧 Adjustments Service (Port 5005)

| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| POST | `/adjustment` | ✅ | admin, staff |
| GET | `/adjustment` | ✅ | - |
| GET | `/adjustment/:id` | ✅ | - |
| PUT | `/adjustment/:id/status` | ✅ | admin, staff |

**Status Flow:** `draft` → `done`

---

## 📊 Dashboard Service (Port 5006)

| Method | Endpoint | Auth Required | Role Required |
|--------|----------|---------------|---------------|
| GET | `/dashboard/summary` | ✅ | - |
| GET | `/dashboard/movements` | ✅ | - |

---

## 📋 Query Parameters

### Products
- `warehouse` - Filter by warehouse
- `category` - Filter by category
- `search` - Search by name/SKU
- `lowStock` - Filter low stock items (true/false)

### Receipts/Deliveries/Transfers/Adjustments
- `warehouse` - Filter by warehouse
- `productId` - Filter by product
- `status` - Filter by status
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

### Dashboard
- `warehouse` - Filter by warehouse
- `category` - Filter by category
- `productId` - Filter by product
- `operationType` - Filter by operation (receipt, delivery, transfer, adjustment, all)
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

---

## 🔑 Status Values

### Receipt Status
- `draft` - Initial state
- `waiting` - Awaiting approval
- `ready` - Approved, ready to process
- `done` - Completed, stock updated
- `canceled` - Cancelled

### Delivery Status
- `draft` - Initial state
- `waiting` - Awaiting approval
- `ready` - Approved, ready to pick
- `picking` - Items being picked
- `packing` - Items being packed
- `done` - Completed, stock updated
- `canceled` - Cancelled

### Transfer Status
- `draft` - Initial state
- `waiting` - Awaiting approval
- `ready` - Approved, ready to process
- `done` - Completed, stock updated
- `canceled` - Cancelled
- `failed` - Transfer failed

### Adjustment Status
- `draft` - Initial state
- `done` - Completed, stock updated

---

## 🎯 Role Permissions

### Admin
- ✅ All operations
- ✅ Create/Update/Delete master data
- ✅ Delete products
- ✅ All status updates

### Staff
- ✅ Create products, receipts, deliveries, transfers, adjustments
- ✅ Update status (with approval)
- ✅ Picking/Packing operations
- ❌ Delete products
- ❌ Delete master data
- ❌ Update master data (admin only)

---

## 📝 Notes

1. **Stock Updates:** Stock sirf `status: 'done'` pe update hota hai
2. **Status Transitions:** Invalid transitions reject ho jayenge
3. **Location:** Optional hai but recommended
4. **Physical Count:** Adjustments mein automatic calculate hota hai
5. **Picking/Packing:** Deliveries ke liye dedicated endpoints

---

**Total Endpoints: 50+**  
**All endpoints are RESTful and follow standard conventions** ✅

