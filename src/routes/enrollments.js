const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticate } = require('../middlewares/auth');


// Routes
router.post('/', authenticate, enrollmentController.enrollInWorkshop); // Learners can enroll
router.get('/', authenticate, enrollmentController.getEnrollmentsByUser); // Learners can see their enrollments

module.exports = router;
