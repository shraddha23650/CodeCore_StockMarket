/**
 * Adjustment Service - Main Entry Point
 * Port: 5005
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const adjustmentRoutes = require('./routes/adjustmentRoutes');
const errorHandler = require('../shared/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5005;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/adjustment', adjustmentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Adjustment service is running', port: PORT });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Adjustment service running on port ${PORT}`);
});

module.exports = app;

