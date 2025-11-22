/**
 * Products Service - Main Entry Point
 * Port: 5001
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const productRoutes = require('./routes/productRoutes');
const masterDataRoutes = require('./routes/masterDataRoutes');
const errorHandler = require('../shared/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/products', productRoutes);
app.use('/settings', masterDataRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Products service is running', port: PORT });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Products service running on port ${PORT}`);
});

module.exports = app;

