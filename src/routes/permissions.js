const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');
const { authenticate, authorize } = require('../middlewares/auth');


// Routes
router.get('/', authenticate, authorize('admin'), permissionController.getAllPermissions); // Admin only

module.exports = router;
