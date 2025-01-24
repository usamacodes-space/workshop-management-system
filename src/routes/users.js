const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/auth');
const { validateRequest } = require('../middlewares/validateMiddleware');
const { validateUserCreation } = require('../middlewares/validators');
// Routes
router.post('/register', validateRequest(validateUserCreation), userController.registerUser);
router.post('/register', userController.registerUser); // Public
router.get('/me', authenticate, userController.getUserDetails); // Authenticated users
router.put('/me/preferences', authenticate, userController.updatePreferences); // Authenticated users

module.exports = router;
