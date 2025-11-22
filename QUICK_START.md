# 🚀 Quick Start Guide

## Fastest Way to Run the Project

### Step 1: Start Backend (Terminal 1)

```bash
cd ODOO/ODOO
docker-compose up
```

**Wait for:** "MongoDB Connected" messages from all services

### Step 2: Start Frontend (Terminal 2 - NEW WINDOW)

```bash
cd stockmaster-inventory-main/stockmaster-inventory-main/stockmaster-inventory-main
npm install
npm run dev
```

### Step 3: Open Browser

Go to: **http://localhost:3000**

---

## ✅ That's It!

1. Register a new user
2. Login
3. View Dashboard with KPIs

---

## 🔍 Verify Everything is Running

### Backend Services (should all respond):
- http://localhost:5000/health ✅
- http://localhost:5001/health ✅
- http://localhost:5002/health ✅
- http://localhost:5003/health ✅
- http://localhost:5004/health ✅
- http://localhost:5005/health ✅
- http://localhost:5006/health ✅

### Frontend:
- http://localhost:3000 ✅

---

## 🛑 To Stop

**Backend:** Press `Ctrl+C` in Terminal 1, then:
```bash
docker-compose down
```

**Frontend:** Press `Ctrl+C` in Terminal 2

---

For detailed instructions, see **HOW_TO_RUN.md**

