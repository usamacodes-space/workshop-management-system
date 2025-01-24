const express = require('express');
const router = express.Router();
const googleCalendarController = require('../utlis/googleCalendar');
const { authenticate } = require('../middlewares/auth');

// Route to initiate OAuth process (Google login)
router.get('/auth', (req, res) => {
  const authUrl = googleCalendarController.getAuthUrl();
  res.redirect(authUrl);
});

// Callback route after user grants permission
router.get('/auth/callback', authenticate, async (req, res) => {
  const { code } = req.query;
  const userId = req.user.user_id; // Assuming the user is authenticated and their ID is available in req.user

  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }

  try {
    const tokens = await googleCalendarController.getAccessToken(code, userId);
    res.json({ message: 'Google Calendar authorization successful', tokens });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
});

// Route to create an event in Google Calendar
router.post('/create-event', authenticate, async (req, res) => {
  const userId = req.user.user_id; // Get the user ID from the authenticated user
  const eventDetails = req.body;  // Assume event details are passed in the body of the request

  try {
    const event = await googleCalendarController.createEvent(eventDetails, userId);
    res.status(200).json({ message: 'Event created successfully', event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create event in Google Calendar' });
  }
});

module.exports = router;
