const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');
const { authenticate, authorize } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validateMiddleware');
const { validateWorkshopCreation } = require('../middlewares/validators');

// Workshop Routes
router.post(
  '/',
  authenticate,
  authorize([1]), // Only mentors (role_id = 1) can create workshops
  validateRequest(validateWorkshopCreation),
  workshopController.createWorkshop
);

router.put(
  '/:workshopId',
  authenticate,
  authorize([1]), // Only mentors (role_id = 1) can update workshops
  workshopController.updateWorkshop
);

router.delete(
  '/:workshopId',
  authenticate,
  authorize([1]), // Only mentors (role_id = 1) can delete workshops
  workshopController.deleteWorkshop
);

router.get(
  '/',
  authenticate, // All authenticated users can list workshops
  workshopController.listWorkshops
);

router.get(
  '/:workshopId',
  authenticate, // All authenticated users can view workshop details
  workshopController.getWorkshopDetails
);

module.exports = router;
