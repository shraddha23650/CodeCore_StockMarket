# Fix: Docker "unexpected end of JSON input" Error

## Problem
You're getting: `unable to get image 'odoo-backend-auth': unexpected end of JSON input`

This error means Docker Desktop's daemon is not fully ready or there's a communication issue.

---

## ✅ Solution 1: Restart Docker Desktop Completely

1. **Quit Docker Desktop:**
   - Right-click Docker icon in system tray
   - Click "Quit Docker Desktop"
   - Wait 30 seconds

2. **Restart Docker Desktop:**
   - Open Docker Desktop from Start Menu
   - Wait 2-3 minutes until it fully starts
   - Make sure it shows "Docker Desktop is running"

3. **Test Docker:**
   ```powershell
   docker ps
   ```
   Should work without errors

4. **Try again:**
   ```powershell
   cd D:\CodeCore_StockMarket\Final\ODOO\ODOO
   docker compose build
   docker compose up
   ```

---

## ✅ Solution 2: Use Manual Method (Recommended - Faster)

Since Docker is having issues, let's run without Docker. This is actually faster for development!

### Step 1: Install MongoDB Locally

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: **Windows**, **MSI** installer
   - Download and install

2. **Start MongoDB:**
   ```powershell
   # Open PowerShell as Administrator
   net start MongoDB
   ```

### Step 2: Setup Backend Services

1. **Navigate to backend:**
   ```powershell
   cd D:\CodeCore_StockMarket\Final\ODOO\ODOO
   ```

2. **Create .env files for all services:**
   ```powershell
   Copy-Item backend-auth\env.example backend-auth\.env
   Copy-Item backend-products\env.example backend-products\.env
   Copy-Item backend-receipt\env.example backend-receipt\.env
   Copy-Item backend-deliveries\env.example backend-deliveries\.env
   Copy-Item backend-transfer\env.example backend-transfer\.env
   Copy-Item backend-adjustment\env.example backend-adjustment\.env
   Copy-Item backend-dashboard\env.example backend-dashboard\.env
   ```

3. **Use the automated script:**
   ```powershell
   .\start-all-services.ps1
   ```

   This will:
   - Check MongoDB
   - Install dependencies
   - Start all 7 services in separate windows

### Step 3: Start Frontend

Open a **NEW PowerShell window:**
```powershell
cd D:\CodeCore_StockMarket\Final\stockmaster-inventory-main\stockmaster-inventory-main\stockmaster-inventory-main
npm install
npm run dev
```

### Step 4: Access Application

Open browser: **http://localhost:3000**

---

## ✅ Solution 3: Build Images One by One

If you want to stick with Docker, try building images individually:

```powershell
# Build MongoDB (will pull from Docker Hub)
docker pull mongo:7.0

# Build each service one by one
docker compose build backend-auth
docker compose build backend-products
docker compose build backend-receipt
docker compose build backend-deliveries
docker compose build backend-transfer
docker compose build backend-adjustment
docker compose build backend-dashboard

# Then start
docker compose up
```

---

## 🎯 Recommended: Use Solution 2 (Manual Method)

**Why?**
- ✅ Faster startup
- ✅ No Docker issues
- ✅ Easier debugging
- ✅ Better for development
- ✅ Same functionality

**Steps:**
1. Install MongoDB
2. Run `.\start-all-services.ps1`
3. Start frontend
4. Done!

---

## Quick Comparison

| Method | Pros | Cons |
|--------|------|------|
| **Docker** | Isolated, production-like | Slower, more complex, can have issues |
| **Manual** | Fast, simple, easy debugging | Need MongoDB installed |

For development, **Manual method is better!**

---

## Next Steps

**I recommend using Solution 2 (Manual Method)** - it's faster and more reliable for development.

1. Install MongoDB
2. Run the PowerShell script
3. Start frontend
4. You're done!

See `RUN_WITHOUT_DOCKER.md` for detailed instructions.

