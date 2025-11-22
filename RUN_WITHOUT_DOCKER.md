# Running the Project Without Docker

## Quick Start (Without Docker)

### Step 1: Install MongoDB Locally

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select: **Windows**, **MSI** installer
   - Download and install

2. **Start MongoDB:**
   ```powershell
   # Open PowerShell as Administrator
   net start MongoDB
   ```

   MongoDB should start automatically as a Windows service.

3. **Verify MongoDB is running:**
   ```powershell
   # Test connection
   mongosh --eval "db.version()"
   ```

### Step 2: Setup Backend Services

1. **Navigate to backend:**
   ```powershell
   cd ODOO/ODOO
   ```

2. **Create .env files for all services:**
   
   Run this PowerShell command to copy env.example to .env for all services:
   ```powershell
   Copy-Item backend-auth\env.example backend-auth\.env
   Copy-Item backend-products\env.example backend-products\.env
   Copy-Item backend-receipt\env.example backend-receipt\.env
   Copy-Item backend-deliveries\env.example backend-deliveries\.env
   Copy-Item backend-transfer\env.example backend-transfer\.env
   Copy-Item backend-adjustment\env.example backend-adjustment\.env
   Copy-Item backend-dashboard\env.example backend-dashboard\.env
   ```

3. **Start all services using the script:**
   ```powershell
   .\start-all-services.ps1
   ```

   This will:
   - Check MongoDB connection
   - Create .env files
   - Install dependencies
   - Start all services in separate windows

### Step 3: Start Frontend

Open a **NEW** PowerShell window:

```powershell
cd stockmaster-inventory-main/stockmaster-inventory-main/stockmaster-inventory-main
npm install
npm run dev
```

### Step 4: Access Application

Open browser: **http://localhost:3000**

---

## Manual Method (If Script Doesn't Work)

### Start Each Service Manually

You'll need to open **7 separate PowerShell windows**, one for each service:

**Window 1 - Auth Service (Port 5000):**
```powershell
cd ODOO/ODOO/backend-auth
npm install
npm start
```

**Window 2 - Products Service (Port 5001):**
```powershell
cd ODOO/ODOO/backend-products
npm install
npm start
```

**Window 3 - Receipts Service (Port 5002):**
```powershell
cd ODOO/ODOO/backend-receipt
npm install
npm start
```

**Window 4 - Deliveries Service (Port 5003):**
```powershell
cd ODOO/ODOO/backend-deliveries
npm install
npm start
```

**Window 5 - Transfers Service (Port 5004):**
```powershell
cd ODOO/ODOO/backend-transfer
npm install
npm start
```

**Window 6 - Adjustments Service (Port 5005):**
```powershell
cd ODOO/ODOO/backend-adjustment
npm install
npm start
```

**Window 7 - Dashboard Service (Port 5006):**
```powershell
cd ODOO/ODOO/backend-dashboard
npm install
npm start
```

**Window 8 - Frontend:**
```powershell
cd stockmaster-inventory-main/stockmaster-inventory-main/stockmaster-inventory-main
npm install
npm run dev
```

---

## Verify Services Are Running

Check each service health endpoint:

- http://localhost:5000/health (Auth)
- http://localhost:5001/health (Products)
- http://localhost:5002/health (Receipts)
- http://localhost:5003/health (Deliveries)
- http://localhost:5004/health (Transfers)
- http://localhost:5005/health (Adjustments)
- http://localhost:5006/health (Dashboard)

All should return: `{"success":true,"message":"...service is running"}`

---

## Troubleshooting

### MongoDB Not Starting

```powershell
# Check if MongoDB service exists
Get-Service MongoDB

# Start MongoDB service (as Administrator)
net start MongoDB

# Or check MongoDB logs
```

### Port Already in Use

If a port is already in use:

```powershell
# Find what's using the port
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Service Not Starting

1. Check `.env` file exists in service directory
2. Verify `MONGODB_URI` is correct: `mongodb://localhost:27017/inventory_db`
3. Check Node.js version: `node --version` (should be v16+)
4. Review service logs for errors

### npm install Fails

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

---

## Alternative: Use MongoDB Atlas (Cloud)

If you don't want to install MongoDB locally:

1. **Create free MongoDB Atlas account:** https://www.mongodb.com/cloud/atlas

2. **Create a cluster** (free tier available)

3. **Get connection string** from Atlas dashboard

4. **Update all .env files** with Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_db
   ```

5. **Start services** as described above

---

## Summary

**Without Docker, you need:**

1. ✅ MongoDB installed locally (or use Atlas)
2. ✅ Node.js installed
3. ✅ .env files created for each service
4. ✅ All services started (7 windows + 1 frontend)

**Use the script** (`start-all-services.ps1`) to automate this process!

