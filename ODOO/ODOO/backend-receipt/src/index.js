/**
 * Receipt Service - Main Entry Point
 * Port: 5002
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const receiptRoutes = require('./routes/receiptRoutes');
const errorHandler = require('../shared/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5002;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/receipt', receiptRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Receipt service is running', port: PORT });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Receipt service running on port ${PORT}`);
});

module.exports = app;

