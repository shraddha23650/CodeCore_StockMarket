# Start Your Project Now (No Docker Needed!)

## ✅ Great News!

**MongoDB is already installed and running!** You don't need Docker at all.

---

## Quick Start (3 Steps)

### Step 1: Start All Backend Services

Run this command in PowerShell:

```powershell
cd D:\CodeCore_StockMarket\Final\ODOO\ODOO
.\start-all-services.ps1
```

This will:
- ✅ Check MongoDB (already running!)
- ✅ Create .env files (already done!)
- ✅ Install dependencies
- ✅ Start all 7 services in separate windows

**You'll see 7 new PowerShell windows open** - one for each service.

### Step 2: Start Frontend

Open a **NEW PowerShell window**:

```powershell
cd D:\CodeCore_StockMarket\Final\stockmaster-inventory-main\stockmaster-inventory-main\stockmaster-inventory-main
npm install
npm run dev
```

### Step 3: Open Your Application

Open browser: **http://localhost:3000**

---

## What You'll See

### Backend Services (7 windows):
- ✅ backend-auth (Port 5000)
- ✅ backend-products (Port 5001)
- ✅ backend-receipt (Port 5002)
- ✅ backend-deliveries (Port 5003)
- ✅ backend-transfer (Port 5004)
- ✅ backend-adjustment (Port 5005)
- ✅ backend-dashboard (Port 5006)

### Frontend:
- ✅ React app on http://localhost:3000

---

## Verify Everything is Running

Check these URLs in your browser:

- http://localhost:5000/health ✅
- http://localhost:5001/health ✅
- http://localhost:5002/health ✅
- http://localhost:5003/health ✅
- http://localhost:5004/health ✅
- http://localhost:5005/health ✅
- http://localhost:5006/health ✅

All should return: `{"success":true,"message":"...service is running"}`

---

## No Docker Images Needed!

Since you're running without Docker:
- ✅ No image building
- ✅ No Docker daemon issues
- ✅ Just Node.js running your code directly
- ✅ Faster and simpler!

---

## To Stop Services

Just close the PowerShell windows for each service.

---

## Ready to Start?

Run this now:

```powershell
cd D:\CodeCore_StockMarket\Final\ODOO\ODOO
.\start-all-services.ps1
```

Then start frontend in a new window!

🎉 **You're all set!**

