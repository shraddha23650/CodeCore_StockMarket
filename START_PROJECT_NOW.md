# Start Your Project - Step by Step

## Current Issue: Docker Desktop Not Fully Started

The error shows Docker Desktop daemon is not accessible. Let's fix this:

---

## ✅ Step 1: Start Docker Desktop Properly

1. **Open Docker Desktop** from Start Menu
2. **Wait for it to fully start** - You should see:
   - Docker Desktop window opens
   - Status shows "Docker Desktop is running"
   - Whale icon in system tray is steady (not animated)
3. **If it's not starting:**
   - Right-click Docker icon → "Restart Docker Desktop"
   - Wait 1-2 minutes for it to fully start

---

## ✅ Step 2: Verify Docker is Working

Open PowerShell and test:

```powershell
docker ps
```

**Expected output:** Should show list of containers (or empty list if none running)
**If error:** Docker Desktop is not ready yet - wait and try again

---

## ✅ Step 3: Start Backend Services

Once Docker is working, run:

```powershell
# Make sure you're in the right directory
cd D:\CodeCore_StockMarket\Final\ODOO\ODOO

# Start all services
docker compose up
```

**What you'll see:**
- Docker will build images (first time only)
- Containers will start
- You'll see logs from all services
- Look for "MongoDB Connected" messages

**Keep this terminal open!** Services need to keep running.

---

## ✅ Step 4: Verify Services Are Running

Open a **NEW browser tab** and check:

- http://localhost:5000/health
- http://localhost:5001/health
- http://localhost:5002/health
- http://localhost:5003/health
- http://localhost:5004/health
- http://localhost:5005/health
- http://localhost:5006/health

All should return: `{"success":true,"message":"...service is running"}`

---

## ✅ Step 5: Start Frontend

Open a **NEW PowerShell window**:

```powershell
cd D:\CodeCore_StockMarket\Final\stockmaster-inventory-main\stockmaster-inventory-main\stockmaster-inventory-main

# Install dependencies (first time only)
npm install

# Start frontend
npm run dev
```

**You should see:**
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:3000/
```

---

## ✅ Step 6: Access Your Application

1. **Open browser**
2. **Go to:** http://localhost:3000
3. **You'll see Login/Register page**

---

## ✅ Step 7: Create Your Account

1. Click **"Register"**
2. Fill in:
   - Name
   - Email
   - Password (min 6 characters)
   - Role (admin or staff)
3. Click **"Register"**
4. You'll be logged in and see the **Dashboard with KPIs**

---

## 🎉 Success!

Your project is now running!

---

## ⚠️ If Docker Still Doesn't Work

### Option A: Restart Docker Desktop
1. Close Docker Desktop completely
2. Restart your computer
3. Open Docker Desktop again
4. Wait for it to fully start
5. Try `docker compose up` again

### Option B: Use Manual Method (Without Docker)

If Docker continues to have issues, you can run without Docker:

1. **Install MongoDB locally:**
   - Download: https://www.mongodb.com/try/download/community
   - Install it
   - Start: `net start MongoDB` (as Administrator)

2. **Use the PowerShell script:**
   ```powershell
   cd D:\CodeCore_StockMarket\Final\ODOO\ODOO
   .\start-all-services.ps1
   ```

3. **Start frontend** (same as Step 5 above)

See `RUN_WITHOUT_DOCKER.md` for detailed instructions.

---

## 📋 Quick Checklist

- [ ] Docker Desktop is open and shows "Running"
- [ ] `docker ps` command works
- [ ] Backend services started with `docker compose up`
- [ ] All health endpoints return success
- [ ] Frontend started with `npm run dev`
- [ ] Can access http://localhost:3000
- [ ] Registered/Logged in successfully
- [ ] Dashboard shows KPIs

---

## 🛑 To Stop Services

**Backend:**
- Press `Ctrl+C` in backend terminal
- Run: `docker compose down`

**Frontend:**
- Press `Ctrl+C` in frontend terminal

---

## Need Help?

If you're still having issues:
1. Make sure Docker Desktop is fully started (wait 2-3 minutes)
2. Try restarting Docker Desktop
3. Check if WSL 2 is installed (Docker Desktop will prompt if needed)
4. Use the manual method (without Docker) as backup

Good luck! 🚀

