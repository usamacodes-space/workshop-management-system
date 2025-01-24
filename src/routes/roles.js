const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticate, authorize } = require('../middlewares/auth');


// Routes
router.post('/', authenticate, authorize('admin'), roleController.createRole); // Admin only
router.get('/', authenticate, authorize('admin'), roleController.getAllRoles); // Admin only

module.exports = router;
