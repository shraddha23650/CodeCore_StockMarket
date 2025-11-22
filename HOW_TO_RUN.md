# How to Run the Project - Complete Guide

This guide will help you run both the **Backend (ODOO)** and **Frontend (stockmaster-inventory-main)** of the StockMaster Inventory Management System.

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- ✅ **Docker Desktop** (for running MongoDB and services) - [Download](https://www.docker.com/products/docker-desktop)
  - OR **MongoDB** installed locally (v7.0+)
- ✅ **Git** (if cloning from repository)
- ✅ **npm** or **bun** package manager

---

## 🚀 Quick Start (Recommended - Using Docker)

### Step 1: Start Backend Services

1. **Navigate to backend directory:**
   ```bash
   cd ODOO/ODOO
   ```

2. **Start all services with Docker Compose:**
   ```bash
   docker-compose up
   ```
   
   This will start:
   - ✅ MongoDB database (port 27017)
   - ✅ Auth Service (port 5000)
   - ✅ Products Service (port 5001)
   - ✅ Receipts Service (port 5002)
   - ✅ Deliveries Service (port 5003)
   - ✅ Transfers Service (port 5004)
   - ✅ Adjustments Service (port 5005)
   - ✅ Dashboard Service (port 5006)

3. **Wait for all services to start** (you'll see "MongoDB Connected" messages)

4. **Verify services are running:**
   - Open browser: `http://localhost:5000/health` (should show Auth service status)
   - Check all ports 5000-5006 are accessible

### Step 2: Start Frontend

1. **Open a NEW terminal window** (keep backend running)

2. **Navigate to frontend directory:**
   ```bash
   cd stockmaster-inventory-main/stockmaster-inventory-main/stockmaster-inventory-main
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   OR if using bun:
   ```bash
   bun install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   OR if using bun:
   ```bash
   bun run dev
   ```

5. **Frontend will start on:** `http://localhost:3000`

### Step 3: Access the Application

1. **Open your browser** and go to: `http://localhost:3000`

2. **Register a new user:**
   - Click "Register"
   - Fill in name, email, password
   - Select role (admin or staff)
   - Click "Register"

3. **Or Login** if you already have an account

4. **Access Dashboard** to see KPIs and inventory data

---

## 🔧 Alternative: Run Backend Services Individually (Without Docker)

If you prefer not to use Docker:

### Step 1: Install and Start MongoDB Locally

1. **Install MongoDB 7.0+** from [mongodb.com](https://www.mongodb.com/try/download/community)

2. **Start MongoDB service:**
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongosh --eval "db.version()"
   ```

### Step 2: Setup Backend Services

1. **Navigate to backend directory:**
   ```bash
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

   **backend-products/.env:**
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/inventory_db
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   ```

   **Repeat for all services** (backend-receipt, backend-deliveries, backend-transfer, backend-adjustment, backend-dashboard)

   **OR copy from env.example:**
   ```bash
   # For each service
   cd backend-auth
   copy env.example .env
   cd ..
   ```

3. **Install dependencies for each service:**
   ```bash
   # Auth Service
   cd backend-auth
   npm install
   npm start
   
   # Open new terminal for Products Service
   cd backend-products
   npm install
   npm start
   
   # Repeat for all services...
   ```

   **OR use a script to start all services** (create `start-all.sh` or `start-all.bat`)

---

## 📝 Step-by-Step Detailed Instructions

### Backend Setup (Docker Method)

1. **Open terminal/PowerShell**

2. **Navigate to project:**
   ```bash
   cd D:\CodeCore_StockMarket\Final\ODOO\ODOO
   ```

3. **Start Docker Desktop** (if not running)

4. **Start all services:**
   ```bash
   docker-compose up
   ```

5. **You should see output like:**
   ```
   inventory-mongodb  | MongoDB starting...
   backend-auth      | Auth service running on port 5000
   backend-products  | Products service running on port 5001
   ...
   ```

6. **Keep this terminal open** - services will keep running

### Frontend Setup

1. **Open a NEW terminal/PowerShell window**

2. **Navigate to frontend:**
   ```bash
   cd D:\CodeCore_StockMarket\Final\stockmaster-inventory-main\stockmaster-inventory-main\stockmaster-inventory-main
   ```

3. **Install dependencies** (first time only):
   ```bash
   npm install
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **You should see:**
   ```
   VITE v5.0.8  ready in 500 ms
   ➜  Local:   http://localhost:3000/
   ```

6. **Open browser** and go to `http://localhost:3000`

---

## ✅ Verification Checklist

### Backend Services

Check each service is running:

- [ ] **MongoDB**: `http://localhost:27017` (or check Docker container)
- [ ] **Auth Service**: `http://localhost:5000/health`
- [ ] **Products Service**: `http://localhost:5001/health`
- [ ] **Receipts Service**: `http://localhost:5002/health`
- [ ] **Deliveries Service**: `http://localhost:5003/health`
- [ ] **Transfers Service**: `http://localhost:5004/health`
- [ ] **Adjustments Service**: `http://localhost:5005/health`
- [ ] **Dashboard Service**: `http://localhost:5006/health`

### Frontend

- [ ] Frontend loads at `http://localhost:3000`
- [ ] Can see Login/Register page
- [ ] Can register a new user
- [ ] Can login
- [ ] Dashboard displays after login
- [ ] KPIs are visible on dashboard

---

## 🐛 Troubleshooting

### Issue: Docker not starting

**Solution:**
- Make sure Docker Desktop is installed and running
- Check Docker Desktop is not paused
- Restart Docker Desktop

### Issue: Port already in use

**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows - Find process using port
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change port in docker-compose.yml
```

### Issue: MongoDB connection error

**Error:** `MongoDB connection error`

**Solution:**
- If using Docker: Check MongoDB container is running
- If using local: Ensure MongoDB service is started
- Verify `MONGODB_URI` in environment variables

### Issue: Frontend can't connect to backend

**Error:** `Network error` or `CORS error`

**Solution:**
- Verify backend services are running
- Check API URLs in `src/api/config.ts`
- Ensure CORS is enabled in backend (it should be by default)

### Issue: npm install fails

**Solution:**
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Or try with different package manager
bun install
```

### Issue: Services not starting

**Solution:**
- Check `.env` files exist in each service
- Verify `MONGODB_URI` is correct
- Check Node.js version: `node --version` (should be v16+)
- Review service logs for specific errors

---

## 🔄 Running in Production

### Backend

1. **Build Docker images:**
   ```bash
   docker-compose build
   ```

2. **Run in detached mode:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

### Frontend

1. **Build for production:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

3. **Deploy to hosting** (Vercel, Netlify, etc.)

---

## 📊 Project Structure

```
Final/
├── ODOO/ODOO/                    # Backend
│   ├── docker-compose.yml       # Docker configuration
│   ├── backend-auth/            # Auth Service (Port 5000)
│   ├── backend-products/        # Products Service (Port 5001)
│   ├── backend-receipt/         # Receipts Service (Port 5002)
│   ├── backend-deliveries/       # Deliveries Service (Port 5003)
│   ├── backend-transfer/         # Transfers Service (Port 5004)
│   ├── backend-adjustment/       # Adjustments Service (Port 5005)
│   └── backend-dashboard/        # Dashboard Service (Port 5006)
│
└── stockmaster-inventory-main/   # Frontend
    └── stockmaster-inventory-main/
        └── stockmaster-inventory-main/
            ├── src/              # Source code
            ├── package.json      # Dependencies
            └── vite.config.ts    # Vite configuration
```

---

## 🎯 Quick Commands Reference

### Backend (Docker)
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend-auth
```

### Frontend
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## 📞 Need Help?

1. **Check service logs** for error messages
2. **Verify all prerequisites** are installed
3. **Review documentation:**
   - `ODOO/ODOO/README.md` - Backend documentation
   - `ODOO/ODOO/MONGODB_CONNECTION_GUIDE.md` - MongoDB setup
   - `stockmaster-inventory-main/.../README.md` - Frontend documentation
   - `stockmaster-inventory-main/.../CONNECTION_GUIDE.md` - Integration guide

---

## ✨ Summary

**To run the project:**

1. **Backend:** `cd ODOO/ODOO && docker-compose up`
2. **Frontend:** `cd stockmaster-inventory-main/.../stockmaster-inventory-main && npm install && npm run dev`
3. **Access:** Open `http://localhost:3000` in browser

**That's it!** Your StockMaster Inventory Management System is now running! 🎉

