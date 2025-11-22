# Frontend-Backend Connection Guide

This document explains how the frontend (stockmaster-inventory-main) is connected to the backend (ODOO).

## Architecture Overview

The system uses a **microservices architecture** where the frontend connects to multiple backend services:

```
Frontend (React/TypeScript)
    ↓
API Services Layer (src/api/)
    ↓
Backend Microservices (Ports 5000-5006)
```

## Backend Services

| Service | Port | Base URL | Purpose |
|---------|------|----------|---------|
| Auth Service | 5000 | `http://localhost:5000` | Authentication & User Management |
| Products Service | 5001 | `http://localhost:5001` | Product CRUD Operations |
| Receipts Service | 5002 | `http://localhost:5002` | Incoming Stock Management |
| Deliveries Service | 5003 | `http://localhost:5003` | Outgoing Stock Management |
| Transfers Service | 5004 | `http://localhost:5004` | Internal Stock Transfers |
| Adjustments Service | 5005 | `http://localhost:5005` | Stock Adjustments |
| Dashboard Service | 5006 | `http://localhost:5006` | KPIs & Analytics |

## Connection Implementation

### 1. API Configuration (`src/api/config.ts`)

Defines base URLs for all backend services:

```typescript
export const API_BASE_URLS = {
  AUTH: 'http://localhost:5000',
  PRODUCTS: 'http://localhost:5001',
  RECEIPTS: 'http://localhost:5002',
  DELIVERIES: 'http://localhost:5003',
  TRANSFERS: 'http://localhost:5004',
  ADJUSTMENTS: 'http://localhost:5005',
  DASHBOARD: 'http://localhost:5006',
};
```

### 2. Base API Service (`src/api/base.ts`)

Handles common API logic:
- Automatic JWT token injection in headers
- Error handling (401 redirects to login)
- Standardized request/response format

### 3. Service Files

Each backend service has a corresponding frontend service file:

- `authService.ts` → Auth Service (Port 5000)
- `productsService.ts` → Products Service (Port 5001)
- `receiptsService.ts` → Receipts Service (Port 5002)
- `deliveriesService.ts` → Deliveries Service (Port 5003)
- `transfersService.ts` → Transfers Service (Port 5004)
- `adjustmentsService.ts` → Adjustments Service (Port 5005)
- `dashboardService.ts` → Dashboard Service (Port 5006)

## Authentication Flow

1. User logs in via `authService.login()`
2. Backend returns JWT token and user data
3. Token stored in `localStorage` via `setAuthToken()`
4. All subsequent API calls include token in `Authorization: Bearer <token>` header
5. On 401 error, token is cleared and user redirected to login

## Dashboard KPI Connection

The Dashboard component (`src/pages/Dashboard.tsx`) connects to the Dashboard Service:

```typescript
// Fetch KPIs
const summaryResponse = await dashboardService.getSummary({
  warehouse: filters.warehouse,
  category: filters.category,
  startDate: filters.startDate,
  endDate: filters.endDate,
});

// Fetch stock movements
const movementsResponse = await dashboardService.getMovements({
  warehouse: filters.warehouse,
  operationType: 'all',
  startDate: filters.startDate,
  endDate: filters.endDate,
});
```

### KPIs Displayed

- Total Products
- Total Stock
- Low Stock Items
- Out of Stock Items
- Total Received
- Total Delivered
- Total Transfers
- Total Adjustments
- Pending Operations (Receipts, Deliveries, Transfers, Adjustments)
- Recent Stock Movements

## Environment Variables

Backend URLs can be configured via environment variables (`.env` file):

```env
VITE_AUTH_URL=http://localhost:5000
VITE_PRODUCTS_URL=http://localhost:5001
VITE_RECEIPTS_URL=http://localhost:5002
VITE_DELIVERIES_URL=http://localhost:5003
VITE_TRANSFERS_URL=http://localhost:5004
VITE_ADJUSTMENTS_URL=http://localhost:5005
VITE_DASHBOARD_URL=http://localhost:5006
```

## Vite Proxy Configuration

The `vite.config.ts` includes proxy configuration for development (optional):

```typescript
server: {
  proxy: {
    '/api/auth': { target: 'http://localhost:5000', ... },
    '/api/products': { target: 'http://localhost:5001', ... },
    // ... etc
  }
}
```

## Setup Instructions

### 1. Start Backend Services

Navigate to `ODOO/ODOO/` and start all backend services:

```bash
# Using Docker Compose
docker-compose up

# Or start each service individually
cd backend-auth && npm start
cd backend-products && npm start
# ... etc
```

### 2. Start Frontend

Navigate to `stockmaster-inventory-main/stockmaster-inventory-main/stockmaster-inventory-main/`:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Access Application

- Frontend: `http://localhost:3000`
- Backend Services: `http://localhost:5000-5006`

## API Request Flow

```
User Action (e.g., View Dashboard)
    ↓
React Component (Dashboard.tsx)
    ↓
Service Call (dashboardService.getSummary())
    ↓
Base API Service (base.ts)
    ↓
HTTP Request with JWT Token
    ↓
Backend Microservice (Port 5006)
    ↓
Response with KPI Data
    ↓
Component State Update
    ↓
UI Rendering
```

## Error Handling

- **Network Errors**: Caught and displayed to user
- **401 Unauthorized**: Token cleared, redirect to login
- **Validation Errors**: Displayed in form/component
- **Server Errors**: Generic error message shown

## CORS Configuration

All backend services have CORS enabled to allow frontend requests. The frontend runs on `http://localhost:3000` and backend services on `http://localhost:5000-5006`.

## Testing the Connection

1. Start all backend services
2. Start frontend (`npm run dev`)
3. Register/Login a user
4. Navigate to Dashboard
5. Verify KPIs are displayed
6. Check browser Network tab for API calls

## Troubleshooting

### CORS Errors
- Ensure backend services have CORS enabled
- Check that frontend URL is allowed in backend CORS config

### 401 Unauthorized
- Token may be expired or invalid
- User will be automatically redirected to login
- Check localStorage for token

### Connection Refused
- Verify backend services are running
- Check port numbers match configuration
- Ensure no firewall blocking ports

### API Not Found (404)
- Verify endpoint URLs match backend routes
- Check service base URLs in `config.ts`
- Review backend route definitions

## Next Steps

To extend the connection:

1. Add new API endpoints in backend
2. Create corresponding methods in service files
3. Use service methods in React components
4. Update types/interfaces as needed

## Summary

The frontend and backend are fully connected through:
- ✅ API service layer with typed interfaces
- ✅ JWT authentication with automatic token management
- ✅ Error handling and user feedback
- ✅ Dashboard KPI integration
- ✅ All backend services accessible from frontend
- ✅ Environment-based configuration

The connection is production-ready and follows best practices for microservices architecture.

