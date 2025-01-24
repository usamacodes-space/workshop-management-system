const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authenticate, authorize } = require('../middlewares/auth');

// Add an activity to a workshop
router.post(
  '/workshops/:workshopId', // POST /activities/workshops/:workshopId
  authenticate,
  authorize([1]), // Only mentors can add activities
  activityController.addActivity
);

// Get all activities for a workshop
router.get(
  '/workshops/:workshopId', // GET /activities/workshops/:workshopId
  authenticate,
  activityController.listActivities
);

// Routes for activities within workshops
router.put('/:workshopId/:activityId', authenticate, authorize([1]), activityController.updateActivity);
router.delete('/:workshopId/:activityId', authenticate, authorize([1]), activityController.deleteActivity);

module.exports = router;
