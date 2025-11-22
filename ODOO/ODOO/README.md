# Inventory Management System - Microservices Backend

A production-ready, scalable Inventory Management System built with Node.js, Express.js, MongoDB, and Docker using a microservices architecture.

## Architecture

The system consists of 7 independent microservices:

1. **backend-auth** (Port 5000) - Authentication & Authorization
2. **backend-products** (Port 5001) - Product Management
3. **backend-receipt** (Port 5002) - Incoming Stock Management
4. **backend-deliveries** (Port 5003) - Outgoing Stock Management
5. **backend-transfer** (Port 5004) - Internal Stock Transfers
6. **backend-adjustment** (Port 5005) - Stock Adjustments
7. **backend-dashboard** (Port 5006) - Analytics & KPIs

## Features

- ✅ JWT-based authentication with role-based access control (admin, staff)
- ✅ Complete product CRUD operations with SKU management
- ✅ Automatic stock updates on receipts (incoming stock)
- ✅ Stock validation on deliveries (outgoing stock)
- ✅ Atomic transactions for stock transfers between warehouses
- ✅ Stock adjustment tracking with audit logs
- ✅ Comprehensive dashboard with KPIs and analytics
- ✅ Centralized error handling and logging
- ✅ Docker containerization for all services
- ✅ MongoDB for data persistence

## Prerequisites

- Node.js 18+ 
- MongoDB 7.0+ (or use Docker)
- Docker & Docker Compose (for containerized deployment)

## Quick Start with Docker

1. **Clone and navigate to the project:**
   ```bash
   cd ODOO
   ```

2. **Start all services with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

3. **Check service status:**
   ```bash
   docker-compose ps
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f [service-name]
   ```

All services will be available on their respective ports (5000-5006).

## Manual Setup (Development)

### 1. Install MongoDB

Make sure MongoDB is running on `localhost:27017`

### 2. Setup Each Service

For each service (backend-auth, backend-products, etc.):

```bash
cd backend-auth
cp env.example .env
npm install
npm start
```

### 3. Environment Variables

Each service requires a `.env` file with:

```env
PORT=<service-port>
MONGODB_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

## API Documentation

### Authentication Service (Port 5000)

**Base URL:** `http://localhost:5000/auth`

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile (JWT required)
- `POST /auth/forgot-password` - Request password reset OTP
- `POST /auth/reset-password` - Reset password with OTP

**Example Register:**
```json
POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "admin"
}
```

**Example Login:**
```json
POST /auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Products Service (Port 5001)

**Base URL:** `http://localhost:5001/products`

All routes require JWT authentication.

- `POST /products` - Create product
- `GET /products` - Get all products (supports query: ?warehouse=, ?category=, ?search=, ?lowStock=true)
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

**Example Create Product:**
```json
POST /products
Headers: Authorization: Bearer <token>
{
  "name": "Laptop",
  "sku": "LAP001",
  "category": "Electronics",
  "quantity": 100,
  "reorderLevel": 10,
  "unit": "pcs",
  "warehouse": "Warehouse A"
}
```

### Receipt Service (Port 5002)

**Base URL:** `http://localhost:5002/receipt`

- `POST /receipt` - Create receipt (auto-increments product stock)
- `GET /receipt` - Get all receipts

**Example Create Receipt:**
```json
POST /receipt
Headers: Authorization: Bearer <token>
{
  "productId": "product_id_here",
  "quantity": 50,
  "supplier": "Supplier ABC",
  "warehouse": "Warehouse A"
}
```

### Deliveries Service (Port 5003)

**Base URL:** `http://localhost:5003/delivery`

- `POST /delivery` - Create delivery (validates and decreases stock)
- `GET /delivery` - Get all deliveries

**Example Create Delivery:**
```json
POST /delivery
Headers: Authorization: Bearer <token>
{
  "productId": "product_id_here",
  "quantity": 20,
  "deliveredTo": "Customer XYZ",
  "warehouse": "Warehouse A"
}
```

### Transfer Service (Port 5004)

**Base URL:** `http://localhost:5004/transfer`

- `POST /transfer` - Create transfer (atomic transaction)
- `GET /transfer` - Get all transfers

**Example Create Transfer:**
```json
POST /transfer
Headers: Authorization: Bearer <token>
{
  "productId": "product_id_here",
  "fromWarehouse": "Warehouse A",
  "toWarehouse": "Warehouse B",
  "quantity": 30
}
```

### Adjustment Service (Port 5005)

**Base URL:** `http://localhost:5005/adjustment`

- `POST /adjustment` - Create adjustment
- `GET /adjustment` - Get all adjustments

**Example Create Adjustment:**
```json
POST /adjustment
Headers: Authorization: Bearer <token>
{
  "productId": "product_id_here",
  "newStock": 150,
  "adjustmentReason": "Physical count correction",
  "warehouse": "Warehouse A"
}
```

### Dashboard Service (Port 5006)

**Base URL:** `http://localhost:5006/dashboard`

- `GET /dashboard/summary` - Get dashboard KPIs
- `GET /dashboard/movements` - Get stock movements

**Query Parameters:**
- `warehouse` - Filter by warehouse
- `category` - Filter by product category
- `productId` - Filter by product
- `operationType` - Filter by operation (receipt, delivery, transfer, adjustment, all)
- `startDate` - Start date filter (ISO format)
- `endDate` - End date filter (ISO format)

**Example:**
```
GET /dashboard/summary?warehouse=Warehouse A&startDate=2024-01-01&endDate=2024-12-31
```

## Response Format

All APIs return a standard response format:

**Success:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message"
}
```

## Database Collections

- `users` - User accounts and authentication
- `products` - Product inventory
- `receipts` - Incoming stock records
- `deliveries` - Outgoing stock records
- `transfers` - Internal transfer records
- `adjustments` - Stock adjustment records

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control (admin, staff)
- OTP-based password reset
- Input validation and sanitization
- Centralized error handling

## Stock Management Logic

1. **Receipts:** Automatically increase product stock
2. **Deliveries:** Validate stock availability before decreasing
3. **Transfers:** Atomic transactions ensure data consistency
4. **Adjustments:** Update stock with full audit trail

## Development

### Running in Development Mode

Each service supports nodemon for hot-reloading:

```bash
npm run dev
```

### Testing Services

Use tools like Postman, curl, or any HTTP client:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","role":"admin"}'
```

## Production Considerations

1. **Environment Variables:** Use secure secrets management
2. **JWT Secret:** Change default JWT_SECRET in production
3. **MongoDB:** Use MongoDB Atlas or managed MongoDB service
4. **Logging:** Implement proper logging service (e.g., Winston, Morgan)
5. **Monitoring:** Add health checks and monitoring
6. **Rate Limiting:** Implement rate limiting for APIs
7. **CORS:** Configure CORS properly for production domains
8. **HTTPS:** Use HTTPS in production

## Troubleshooting

### Services not starting
- Check MongoDB is running
- Verify environment variables are set
- Check port availability

### Database connection errors
- Ensure MongoDB URI is correct
- Check network connectivity
- Verify MongoDB is accessible

### JWT errors
- Ensure JWT_SECRET matches across all services
- Check token expiration
- Verify Authorization header format: `Bearer <token>`

## License

This project is built for educational and production use.

## Support

For issues and questions, please check the service logs:
```bash
docker-compose logs [service-name]
```

