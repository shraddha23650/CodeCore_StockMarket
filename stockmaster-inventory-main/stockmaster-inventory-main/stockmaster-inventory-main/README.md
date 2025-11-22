# StockMaster Inventory Management System

Frontend application for the StockMaster Inventory Management System, connected to the ODOO backend microservices.

## Features

- 🔐 Authentication (Login/Register)
- 📊 Dashboard with KPIs
- 📦 Product Management
- 📥 Receipts Management
- 📤 Deliveries Management
- 🔄 Transfers Management
- 🔧 Stock Adjustments

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS

## Backend Services

The frontend connects to the following backend microservices:

- **Auth Service**: `http://localhost:5000`
- **Products Service**: `http://localhost:5001`
- **Receipts Service**: `http://localhost:5002`
- **Deliveries Service**: `http://localhost:5003`
- **Transfers Service**: `http://localhost:5004`
- **Adjustments Service**: `http://localhost:5005`
- **Dashboard Service**: `http://localhost:5006`

## Setup

1. Install dependencies:
```bash
npm install
# or
bun install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update the `.env` file with your backend URLs if different from defaults.

4. Start the development server:
```bash
npm run dev
# or
bun run dev
```

5. Open your browser to `http://localhost:3000`

## Project Structure

```
src/
├── api/              # API service files
│   ├── config.ts     # API configuration
│   ├── base.ts       # Base API service
│   ├── authService.ts
│   ├── dashboardService.ts
│   ├── productsService.ts
│   ├── receiptsService.ts
│   ├── deliveriesService.ts
│   ├── transfersService.ts
│   └── adjustmentsService.ts
├── components/       # Reusable components
│   ├── Layout.tsx
│   └── ProtectedRoute.tsx
├── contexts/         # React contexts
│   └── AuthContext.tsx
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── App.tsx          # Main app component
└── main.tsx         # Entry point
```

## API Integration

All API calls are handled through service files in the `src/api/` directory. Each service corresponds to a backend microservice and provides typed methods for all endpoints.

### Example Usage

```typescript
import dashboardService from './api/dashboardService';

// Get dashboard summary
const response = await dashboardService.getSummary({
  warehouse: 'Warehouse A',
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});

if (response.success && response.data) {
  console.log(response.data.totalProducts);
}
```

## Authentication

The app uses JWT tokens stored in localStorage. The `AuthContext` provides authentication state and methods throughout the app.

### Protected Routes

Routes are protected using the `ProtectedRoute` component, which redirects unauthenticated users to the login page.

## Dashboard KPIs

The dashboard displays the following KPIs:

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

## Development

- Run linter: `npm run lint`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Notes

- Make sure all backend services are running before starting the frontend
- CORS is enabled on all backend services
- Authentication tokens are automatically included in API requests
- The app automatically redirects to login on 401 errors

