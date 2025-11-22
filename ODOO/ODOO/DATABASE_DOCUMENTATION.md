# Database Documentation - Inventory Management System

## 📊 Database Overview

**Database Name:** `inventory_db`  
**Database Type:** MongoDB 7.0+  
**Connection String:** `mongodb://localhost:27017/inventory_db` (Development)  
**Connection String (Docker):** `mongodb://mongodb:27017/inventory_db`

---

## 🗄️ Collections (Tables)

There are total **9 collections** in system:

1. **users** - User accounts aur authentication
2. **products** - Product inventory
3. **warehouses** - Warehouse master data
4. **categories** - Category master data
5. **locations** - Location/Rack master data
6. **receipts** - Incoming stock records
7. **deliveries** - Outgoing stock records
8. **transfers** - Internal transfer records
9. **adjustments** - Stock adjustment records

---

## 📋 Collection Schemas

### 1. **users** Collection

**Purpose:** User accounts, authentication, aur roles

**Schema:**
```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase, validated),
  password: String (required, min 6 chars, hashed with bcrypt),
  role: String (enum: ['admin', 'staff'], default: 'staff'),
  otp: {
    code: String,
    expiresAt: Date
  },
  createdAt: Date (default: now)
}
```

**Indexes:**
- `email` (unique)

**Special Features:**
- Password auto-hashing before save
- `comparePassword()` method for login

---

### 2. **products** Collection

**Purpose:** Product inventory with stock tracking

**Schema:**
```javascript
{
  name: String (required, trimmed),
  sku: String (required, uppercase, unique per warehouse),
  category: String (required, trimmed),
  quantity: Number (required, default: 0, min: 0),
  reorderLevel: Number (default: 10, min: 0),
  unit: String (required, default: 'pcs'),
  warehouse: String (required, trimmed),
  location: String (optional, trimmed),
  stockHistory: [{
    warehouse: String,
    location: String,
    quantity: Number,
    updatedAt: Date
  }],
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

**Indexes:**
- `{ sku: 1, warehouse: 1 }` (unique) - SKU unique per warehouse
- `warehouse: 1` - Fast warehouse queries
- `category: 1` - Fast category queries

**Key Points:**
- Same SKU different warehouses mein different products ho sakte hain
- Stock history tracks all stock changes
- Location optional hai but recommended

---

### 3. **warehouses** Collection

**Purpose:** Warehouse master data

**Schema:**
```javascript
{
  name: String (required, unique, trimmed),
  code: String (required, unique, uppercase),
  address: String (optional, trimmed),
  description: String (optional, trimmed),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

**Indexes:**
- `code: 1` (unique)
- `name: 1` (unique)

**Key Points:**
- Soft delete: `isActive: false` instead of hard delete
- Code aur name dono unique hain

---

### 4. **categories** Collection

**Purpose:** Product category master data

**Schema:**
```javascript
{
  name: String (required, unique, trimmed),
  code: String (required, unique, uppercase),
  description: String (optional, trimmed),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

**Indexes:**
- `code: 1` (unique)
- `name: 1` (unique)

**Key Points:**
- Soft delete support
- Code aur name unique

---

### 5. **locations** Collection

**Purpose:** Location/Rack master data (warehouse ke andar)

**Schema:**
```javascript
{
  name: String (required, trimmed),
  code: String (required, uppercase),
  warehouse: String (required, trimmed),
  description: String (optional, trimmed),
  isActive: Boolean (default: true),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

**Indexes:**
- `{ code: 1, warehouse: 1 }` (unique) - Code unique per warehouse
- `warehouse: 1` - Fast warehouse queries

**Key Points:**
- Same code different warehouses mein use ho sakta hai
- Location code warehouse ke andar unique hai

---

### 6. **receipts** Collection

**Purpose:** Incoming stock records (vendor se maal aana)

**Schema:**
```javascript
{
  productId: ObjectId (required, ref: 'Product'),
  quantity: Number (required, min: 1),
  supplier: String (required, trimmed),
  warehouse: String (required, trimmed),
  location: String (optional, trimmed),
  status: String (enum: ['draft', 'waiting', 'ready', 'done', 'canceled'], default: 'draft'),
  receivedBy: ObjectId (required, ref: 'User'),
  approvedBy: ObjectId (optional, ref: 'User'),
  date: Date (default: now),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

**Indexes:**
- `productId: 1`
- `warehouse: 1`
- `status: 1`
- `date: -1` (descending)

**Key Points:**
- Stock update sirf `status: 'done'` pe hota hai
- Status workflow: draft → waiting → ready → done/canceled

---

### 7. **deliveries** Collection

**Purpose:** Outgoing stock records (customer ko maal bhejna)

**Schema:**
```javascript
{
  productId: ObjectId (required, ref: 'Product'),
  quantity: Number (required, min: 1),
  deliveredTo: String (required, trimmed),
  warehouse: String (required, trimmed),
  location: String (optional, trimmed),
  status: String (enum: ['draft', 'waiting', 'ready', 'picking', 'packing', 'done', 'canceled'], default: 'draft'),
  pickedQuantity: Number (default: 0, min: 0),
  packedQuantity: Number (default: 0, min: 0),
  deliveredBy: ObjectId (required, ref: 'User'),
  approvedBy: ObjectId (optional, ref: 'User'),
  date: Date (default: now),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

**Indexes:**
- `productId: 1`
- `warehouse: 1`
- `status: 1`
- `date: -1` (descending)

**Key Points:**
- Picking aur packing workflows support
- Stock update sirf `status: 'done'` pe hota hai
- Status workflow: draft → waiting → ready → picking → packing → done/canceled

---

### 8. **transfers** Collection

**Purpose:** Internal stock transfers (warehouse to warehouse)

**Schema:**
```javascript
{
  productId: ObjectId (required, ref: 'Product'),
  fromWarehouse: String (required, trimmed),
  toWarehouse: String (required, trimmed),
  fromLocation: String (optional, trimmed),
  toLocation: String (optional, trimmed),
  quantity: Number (required, min: 1),
  transferredBy: ObjectId (required, ref: 'User'),
  approvedBy: ObjectId (optional, ref: 'User'),
  date: Date (default: now),
  status: String (enum: ['draft', 'waiting', 'ready', 'done', 'canceled', 'failed'], default: 'draft'),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

**Indexes:**
- `productId: 1`
- `fromWarehouse: 1`
- `toWarehouse: 1`
- `status: 1`
- `date: -1` (descending)

**Key Points:**
- Atomic transactions: source decrease, destination increase
- Stock update sirf `status: 'done'` pe hota hai
- Status workflow: draft → waiting → ready → done/canceled/failed

---

### 9. **adjustments** Collection

**Purpose:** Stock adjustments (physical count corrections)

**Schema:**
```javascript
{
  productId: ObjectId (required, ref: 'Product'),
  oldStock: Number (required, min: 0),
  newStock: Number (required, min: 0),
  physicalCount: Number (optional, min: 0),
  adjustmentReason: String (required, trimmed),
  warehouse: String (required, trimmed),
  location: String (optional, trimmed),
  status: String (enum: ['draft', 'done'], default: 'draft'),
  adjustedBy: ObjectId (required, ref: 'User'),
  approvedBy: ObjectId (optional, ref: 'User'),
  date: Date (default: now),
  createdAt: Date (default: now),
  updatedAt: Date (auto-updated)
}
```

**Indexes:**
- `productId: 1`
- `warehouse: 1`
- `status: 1`
- `date: -1` (descending)

**Key Points:**
- Physical count support
- Automatic difference calculation
- Stock update sirf `status: 'done'` pe hota hai

---

## 🔗 Relationships

### References (ObjectId References)

1. **receipts.productId** → **products._id**
2. **receipts.receivedBy** → **users._id**
3. **receipts.approvedBy** → **users._id**

4. **deliveries.productId** → **products._id**
5. **deliveries.deliveredBy** → **users._id**
6. **deliveries.approvedBy** → **users._id**

7. **transfers.productId** → **products._id**
8. **transfers.transferredBy** → **users._id**
9. **transfers.approvedBy** → **users._id**

10. **adjustments.productId** → **products._id**
11. **adjustments.adjustedBy** → **users._id**
12. **adjustments.approvedBy** → **users._id**

### String References (Not Foreign Keys)

- **products.warehouse** → **warehouses.name** (string match)
- **products.category** → **categories.name** (string match)
- **products.location** → **locations.code** (string match)
- **locations.warehouse** → **warehouses.name** (string match)

**Note:** String references MongoDB foreign keys nahi hain, lekin application level pe validate kiye ja sakte hain.

---

## 📊 Database Statistics

### Collection Sizes (Estimated)

- **users**: Small (~100-1000 documents)
- **warehouses**: Very small (~10-50 documents)
- **categories**: Very small (~20-100 documents)
- **locations**: Small (~50-500 documents)
- **products**: Medium to Large (depends on inventory size)
- **receipts**: Large (grows over time)
- **deliveries**: Large (grows over time)
- **transfers**: Medium (grows over time)
- **adjustments**: Small to Medium (grows over time)

---

## 🔍 Indexes Summary

### Unique Indexes
- `users.email` - Unique
- `products.{sku, warehouse}` - Unique combination
- `warehouses.code` - Unique
- `warehouses.name` - Unique
- `categories.code` - Unique
- `categories.name` - Unique
- `locations.{code, warehouse}` - Unique combination

### Performance Indexes
- All `productId` fields - Fast product lookups
- All `warehouse` fields - Fast warehouse filtering
- All `status` fields - Fast status filtering
- All `date` fields (descending) - Fast date sorting

---

## 🚀 Database Setup

### Using Docker (Recommended)

```bash
docker-compose up -d mongodb
```

MongoDB automatically start hoga on port `27017`.

### Manual Setup

1. Install MongoDB 7.0+
2. Start MongoDB service
3. Database automatically create hoga jab pehli connection aayegi

### Connection String

**Development:**
```
mongodb://localhost:27017/inventory_db
```

**Docker:**
```
mongodb://mongodb:27017/inventory_db
```

**Production (MongoDB Atlas):**
```
mongodb+srv://username:password@cluster.mongodb.net/inventory_db
```

---

## 🔒 Security Features

1. **Password Hashing:** Bcrypt with salt rounds 10
2. **JWT Tokens:** Secure authentication
3. **Input Validation:** Mongoose validators
4. **Indexes:** Performance optimization
5. **Transactions:** Atomic operations for stock updates

---

## 📝 Best Practices

1. **Always use transactions** for stock updates
2. **Validate warehouse/category** before creating products
3. **Check stock availability** before deliveries
4. **Use status workflows** properly
5. **Track location** for better inventory management
6. **Use indexes** for fast queries
7. **Soft delete** master data (isActive: false)

---

## 🛠️ Database Maintenance

### Backup
```bash
mongodump --db inventory_db --out /backup/path
```

### Restore
```bash
mongorestore --db inventory_db /backup/path/inventory_db
```

### View Collections
```javascript
use inventory_db
show collections
```

### Count Documents
```javascript
db.products.countDocuments()
db.receipts.countDocuments()
```

---

## ✅ Database Status

**Database:** ✅ Configured  
**Collections:** ✅ 9 Collections  
**Indexes:** ✅ All optimized  
**Relationships:** ✅ Properly defined  
**Transactions:** ✅ Implemented  
**Security:** ✅ Password hashing, JWT  

**Database is production-ready!** 🎉

