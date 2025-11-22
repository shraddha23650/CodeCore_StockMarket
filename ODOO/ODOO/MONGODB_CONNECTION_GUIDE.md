# MongoDB Connection Guide

## ✅ MongoDB is Fully Configured

The backend uses **MongoDB 7.0+** as the database for all microservices.

## Database Configuration

### Database Details
- **Database Name:** `inventory_db`
- **Database Type:** MongoDB 7.0+
- **Port:** `27017` (default MongoDB port)

### Connection Strings

#### Development (Local MongoDB)
```
mongodb://localhost:27017/inventory_db
```

#### Docker (Using docker-compose)
```
mongodb://mongodb:27017/inventory_db
```

#### Production (MongoDB Atlas)
```
mongodb+srv://username:password@cluster.mongodb.net/inventory_db
```

## How MongoDB is Connected

### 1. Docker Compose Setup

The `docker-compose.yml` includes a MongoDB service:

```yaml
mongodb:
  image: mongo:7.0
  container_name: inventory-mongodb
  restart: unless-stopped
  ports:
    - "27017:27017"
  environment:
    MONGO_INITDB_DATABASE: inventory_db
  volumes:
    - mongodb_data:/data/db
  networks:
    - inventory-network
```

### 2. Database Connection File

Each backend service has a `src/config/database.js` file:

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### 3. Environment Variables

Each service uses `MONGODB_URI` from environment variables:

**Development (.env file):**
```env
MONGODB_URI=mongodb://localhost:27017/inventory_db
```

**Docker (docker-compose.yml):**
```yaml
environment:
  MONGODB_URI: mongodb://mongodb:27017/inventory_db
```

## All Services Connected to MongoDB

All 7 backend services connect to the same MongoDB database:

| Service | Port | MongoDB Connection |
|---------|------|-------------------|
| Auth Service | 5000 | ✅ Connected |
| Products Service | 5001 | ✅ Connected |
| Receipts Service | 5002 | ✅ Connected |
| Deliveries Service | 5003 | ✅ Connected |
| Transfers Service | 5004 | ✅ Connected |
| Adjustments Service | 5005 | ✅ Connected |
| Dashboard Service | 5006 | ✅ Connected |

## Database Collections

The database contains **9 collections**:

1. **users** - User accounts and authentication
2. **products** - Product inventory
3. **warehouses** - Warehouse master data
4. **categories** - Category master data
5. **locations** - Location/Rack master data
6. **receipts** - Incoming stock records
7. **deliveries** - Outgoing stock records
8. **transfers** - Internal transfer records
9. **adjustments** - Stock adjustment records

## Setup Instructions

### Option 1: Using Docker Compose (Recommended)

1. Navigate to `ODOO/ODOO/`:
```bash
cd ODOO/ODOO
```

2. Start all services including MongoDB:
```bash
docker-compose up
```

This will:
- Start MongoDB container on port 27017
- Start all backend services
- All services automatically connect to MongoDB

### Option 2: Local MongoDB Installation

1. Install MongoDB 7.0+ on your system

2. Start MongoDB service:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

3. Create `.env` file in each backend service:
```env
MONGODB_URI=mongodb://localhost:27017/inventory_db
```

4. Start each backend service individually

### Option 3: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a cluster
3. Get connection string
4. Update `.env` file:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_db
```

## Verification

### Check MongoDB Connection

1. **Check if MongoDB is running:**
```bash
# Docker
docker ps | grep mongodb

# Local
mongosh --eval "db.version()"
```

2. **Check service logs:**
Each service logs MongoDB connection status:
```
MongoDB Connected: localhost
```

3. **Test connection from service:**
```bash
# Check any service health endpoint
curl http://localhost:5000/health
```

### Verify Database

1. **Connect to MongoDB:**
```bash
mongosh mongodb://localhost:27017/inventory_db
```

2. **List collections:**
```javascript
show collections
```

3. **Check data:**
```javascript
db.users.find()
db.products.find()
```

## Connection Flow

```
Backend Service Starts
    ↓
Load Environment Variables (MONGODB_URI)
    ↓
Call connectDB() from database.js
    ↓
Mongoose connects to MongoDB
    ↓
Connection established
    ↓
Service ready to handle requests
```

## Troubleshooting

### Connection Refused
- **Issue:** MongoDB not running
- **Solution:** Start MongoDB service or docker container

### Authentication Failed
- **Issue:** Wrong credentials (for Atlas)
- **Solution:** Check MongoDB Atlas credentials

### Network Error
- **Issue:** Firewall blocking port 27017
- **Solution:** Allow port 27017 in firewall

### Database Not Found
- **Issue:** Database name mismatch
- **Solution:** Ensure `inventory_db` exists or MongoDB will create it automatically

### Connection Timeout
- **Issue:** MongoDB service not accessible
- **Solution:** Check MongoDB is running and accessible on port 27017

## Environment Variables Checklist

Each backend service needs these environment variables:

```env
PORT=5000                    # Service port
MONGODB_URI=mongodb://...    # MongoDB connection string
JWT_SECRET=your_secret       # JWT secret key
JWT_EXPIRES_IN=7d           # Token expiration
```

## Summary

✅ **MongoDB is fully configured and connected**
✅ **All 7 backend services use the same MongoDB database**
✅ **Docker Compose includes MongoDB service**
✅ **Connection is handled via Mongoose**
✅ **Environment variables for flexible configuration**

The MongoDB connection is production-ready and works with:
- Local MongoDB installation
- Docker Compose setup
- MongoDB Atlas (cloud)

For detailed database schema information, see `DATABASE_DOCUMENTATION.md`.

