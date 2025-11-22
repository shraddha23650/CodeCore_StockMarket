# Next Steps After Installing Docker

## ✅ Docker is Installed!

Now let's start your project.

---

## Step 1: Make Sure Docker Desktop is Running

1. **Open Docker Desktop** from Start Menu
2. **Wait for it to fully start** (whale icon in system tray should be steady)
3. You should see "Docker Desktop is running" in the app

---

## Step 2: Start Backend Services

1. **Open PowerShell or Command Prompt**

2. **Navigate to backend directory:**
   ```powershell
   cd ODOO/ODOO
   ```

3. **Start all services:**
   ```powershell
   docker compose up
   ```

   **Note:** Use `docker compose` (without hyphen) - this is the new syntax for Docker Compose v2.

4. **Wait for services to start** - You'll see output like:
   ```
   inventory-mongodb  | MongoDB starting...
   backend-auth      | Auth service running on port 5000
   backend-products  | Products service running on port 5001
   ...
   ```

5. **Look for "MongoDB Connected" messages** from all services

6. **Keep this terminal window open** - services need to keep running

---

## Step 3: Verify Backend Services

Open a **NEW browser tab** and check these URLs:

- ✅ http://localhost:5000/health (Auth Service)
- ✅ http://localhost:5001/health (Products Service)
- ✅ http://localhost:5002/health (Receipts Service)
- ✅ http://localhost:5003/health (Deliveries Service)
- ✅ http://localhost:5004/health (Transfers Service)
- ✅ http://localhost:5005/health (Adjustments Service)
- ✅ http://localhost:5006/health (Dashboard Service)

All should return: `{"success":true,"message":"...service is running"}`

---

## Step 4: Start Frontend

1. **Open a NEW PowerShell/Command Prompt window** (keep backend terminal open!)

2. **Navigate to frontend directory:**
   ```powershell
   cd stockmaster-inventory-main/stockmaster-inventory-main/stockmaster-inventory-main
   ```

3. **Install dependencies** (first time only):
   ```powershell
   npm install
   ```

4. **Start frontend development server:**
   ```powershell
   npm run dev
   ```

5. **You should see:**
   ```
   VITE v5.0.8  ready in 500 ms
   ➜  Local:   http://localhost:3000/
   ```

---

## Step 5: Access Your Application

1. **Open your browser**
2. **Go to:** http://localhost:3000
3. **You should see the Login/Register page**

---

## Step 6: Create Your First User

1. **Click "Register"**
2. **Fill in the form:**
   - Name: Your name
   - Email: your@email.com
   - Password: (at least 6 characters)
   - Role: Select "admin" or "staff"
3. **Click "Register"**
4. **You'll be automatically logged in and redirected to Dashboard**

---

## Step 7: Explore the Dashboard

Once logged in, you'll see:
- ✅ **KPIs** (Key Performance Indicators):
  - Total Products
  - Total Stock
  - Low Stock Items
  - Out of Stock Items
  - Total Received/Delivered
  - Pending Operations
- ✅ **Stock Movements** table
- ✅ **Filters** for warehouse, category, date range

---

## 🎉 Success!

Your StockMaster Inventory Management System is now running!

---

## Important Notes

### Keep Both Terminals Open
- **Terminal 1:** Backend services (docker compose up)
- **Terminal 2:** Frontend (npm run dev)

### To Stop Services

**Backend:**
- Press `Ctrl+C` in the backend terminal
- Then run: `docker compose down`

**Frontend:**
- Press `Ctrl+C` in the frontend terminal

---

## Troubleshooting

### Docker Desktop Not Running
- Make sure Docker Desktop is open and running
- Check system tray for Docker icon

### Port Already in Use
```powershell
# Find what's using the port
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Services Not Starting
- Check Docker Desktop is running
- Check if ports 5000-5006 are available
- Review error messages in terminal

### Frontend Can't Connect
- Verify backend services are running (check health endpoints)
- Make sure backend terminal is still open
- Check browser console for errors

### MongoDB Connection Error
- Wait a bit longer - MongoDB takes time to start
- Check Docker Desktop shows MongoDB container running
- Restart: `docker compose down` then `docker compose up`

---

## Quick Command Reference

```powershell
# Start backend
cd ODOO/ODOO
docker compose up

# Stop backend
docker compose down

# View logs
docker compose logs -f

# Restart a service
docker compose restart backend-auth

# Start frontend
cd stockmaster-inventory-main/stockmaster-inventory-main/stockmaster-inventory-main
npm run dev
```

---

## Next Steps After Setup

1. ✅ Explore the Dashboard
2. ✅ Add some products
3. ✅ Create receipts (incoming stock)
4. ✅ Create deliveries (outgoing stock)
5. ✅ View KPIs update in real-time

Enjoy your Inventory Management System! 🚀

