# Solution: Docker Not Found Error

## Problem
You're getting: `docker-compose : The term 'docker-compose' is not recognized`

This means Docker is not installed on your system.

---

## ✅ Solution 1: Install Docker Desktop (Recommended)

### Step 1: Download Docker Desktop

1. Go to: **https://www.docker.com/products/docker-desktop/**
2. Click **"Download for Windows"**
3. Download the installer

### Step 2: Install Docker Desktop

1. Run the installer
2. Follow the installation wizard
3. **Restart your computer** when prompted

### Step 3: Start Docker Desktop

1. Open **Docker Desktop** from Start Menu
2. Wait for it to start (whale icon in system tray)
3. Make sure it says "Docker Desktop is running"

### Step 4: Verify Installation

Open PowerShell and run:
```powershell
docker --version
```

You should see something like: `Docker version 24.0.0...`

### Step 5: Use New Docker Compose Syntax

**Important:** Newer Docker versions use `docker compose` (without hyphen) instead of `docker-compose`

```powershell
cd ODOO/ODOO
docker compose up
```

---

## ✅ Solution 2: Run Without Docker (Alternative)

If you don't want to install Docker, you can run services manually with MongoDB installed locally.

### Step 1: Install MongoDB Locally

1. Download MongoDB Community Server:
   - **https://www.mongodb.com/try/download/community**
   - Select: Windows, MSI installer
   - Download and install

2. Start MongoDB Service:
   ```powershell
   # Open PowerShell as Administrator
   net start MongoDB
   ```

   Or MongoDB should start automatically as a Windows service.

### Step 2: Setup Backend Services

1. **Navigate to backend directory:**
   ```powershell
   cd ODOO/ODOO
   ```

2. **For each service, create `.env` file:**

   **backend-auth/.env:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/inventory_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   ```

   **Copy this for all services:**
   - backend-products
   - backend-receipt
   - backend-deliveries
   - backend-transfer
   - backend-adjustment
   - backend-dashboard

   **Quick way to create all .env files:**
   ```powershell
   # Copy env.example to .env for each service
   Copy-Item backend-auth\env.example backend-auth\.env
   Copy-Item backend-products\env.example backend-products\.env
   Copy-Item backend-receipt\env.example backend-receipt\.env
   Copy-Item backend-deliveries\env.example backend-deliveries\.env
   Copy-Item backend-transfer\env.example backend-transfer\.env
   Copy-Item backend-adjustment\env.example backend-adjustment\.env
   Copy-Item backend-dashboard\env.example backend-dashboard\.env
   ```

3. **Install dependencies for each service:**

   You'll need to open multiple terminal windows, one for each service:

   **Terminal 1 - Auth Service:**
   ```powershell
   cd ODOO/ODOO/backend-auth
   npm install
   npm start
   ```

   **Terminal 2 - Products Service:**
   ```powershell
   cd ODOO/ODOO/backend-products
   npm install
   npm start
   ```

   **Terminal 3 - Receipts Service:**
   ```powershell
   cd ODOO/ODOO/backend-receipt
   npm install
   npm start
   ```

   **Terminal 4 - Deliveries Service:**
   ```powershell
   cd ODOO/ODOO/backend-deliveries
   npm install
   npm start
   ```

   **Terminal 5 - Transfers Service:**
   ```powershell
   cd ODOO/ODOO/backend-transfer
   npm install
   npm start
   ```

   **Terminal 6 - Adjustments Service:**
   ```powershell
   cd ODOO/ODOO/backend-adjustment
   npm install
   npm start
   ```

   **Terminal 7 - Dashboard Service:**
   ```powershell
   cd ODOO/ODOO/backend-dashboard
   npm install
   npm start
   ```

### Step 3: Start Frontend

Open another terminal:
```powershell
cd stockmaster-inventory-main/stockmaster-inventory-main/stockmaster-inventory-main
npm install
npm run dev
```

---

## 🚀 Quick Solution: Use PowerShell Script

I'll create a script to help you start all services without Docker.

---

## 📝 Which Solution to Choose?

### Choose Solution 1 (Docker) if:
- ✅ You want the easiest setup
- ✅ You don't mind installing Docker Desktop
- ✅ You want automatic service management
- ✅ You want isolated environments

### Choose Solution 2 (Manual) if:
- ✅ You can't install Docker Desktop
- ✅ You prefer running services individually
- ✅ You want more control over each service
- ✅ You already have MongoDB installed

---

## ⚠️ Important Notes

1. **Docker Desktop requires:**
   - Windows 10/11 64-bit
   - WSL 2 (Windows Subsystem for Linux)
   - Virtualization enabled in BIOS

2. **If Docker installation fails:**
   - Enable WSL 2: `wsl --install`
   - Enable Virtualization in BIOS
   - Use Solution 2 instead

3. **MongoDB Alternative:**
   - You can also use MongoDB Atlas (cloud) instead of local MongoDB
   - Update `MONGODB_URI` in `.env` files with Atlas connection string

---

## Next Steps

After choosing a solution:

1. **If using Docker:** Install Docker Desktop, then run `docker compose up`
2. **If using Manual:** Install MongoDB, setup `.env` files, start each service

Then proceed with starting the frontend as described in `HOW_TO_RUN.md`

