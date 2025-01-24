const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middlewares/auth');

// Routes
router.get('/', authenticate, notificationController.getNotificationsByUser);  // Get notifications with pagination
router.put('/:notification_id/read', authenticate, notificationController.markAsRead);  // Mark a single notification as read
router.put('/all/read', authenticate, notificationController.markAllAsRead);  // Mark all notifications as read

module.exports = router;
