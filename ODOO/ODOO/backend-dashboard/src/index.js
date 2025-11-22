/**
 * Dashboard Service - Main Entry Point
 * Port: 5006
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorHandler = require('../shared/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5006;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/dashboard', dashboardRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Dashboard service is running', port: PORT });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Dashboard service running on port ${PORT}`);
});

module.exports = app;

