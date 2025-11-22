/**
 * Dashboard Routes
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken } = require('../../shared/middlewares/auth');

// All routes are JWT protected
router.use(verifyToken);

router.get('/summary', dashboardController.getSummary.bind(dashboardController));
router.get('/movements', dashboardController.getMovements.bind(dashboardController));

module.exports = router;

