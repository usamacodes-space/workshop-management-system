const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');
const { GoogleAuthToken } = require('../models'); // Import GoogleAuthToken model
const dotenv = require('dotenv');

dotenv.config();

// OAuth2 credentials from Google Cloud Console
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Google Calendar API
const calendar = google.calendar('v3');

// Generate the authentication URL for OAuth2
function getAuthUrl() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: 'https://www.googleapis.com/auth/calendar',
  });
  return authUrl;
}

// Exchange authorization code for access token
async function getAccessToken(code, userId) {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Store the tokens in the database
  await GoogleAuthToken.upsert({
    user_id: userId,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expiry_date: new Date(tokens.expiry_date), // Store the token expiry date
  });

  return tokens;
}

// Helper function to refresh the access token when it expires
async function refreshAccessToken(userId) {
  const tokenRecord = await GoogleAuthToken.findOne({ where: { user_id: userId } });

  if (!tokenRecord) {
    throw new Error('No Google OAuth tokens found for the user');
  }

  oauth2Client.setCredentials({
    refresh_token: tokenRecord.refresh_token,
  });

  // Refresh the access token
  const { credentials } = await oauth2Client.refreshAccessToken();

  // Update the tokens in the database
  await tokenRecord.update({
    access_token: credentials.access_token,
    expiry_date: new Date(credentials.expiry_date),
  });

  return credentials;
}

// Create a calendar event
async function createEvent(eventDetails, userId) {
  // Get the user's stored tokens, refresh if expired
  let tokenRecord = await GoogleAuthToken.findOne({ where: { user_id: userId } });

  if (!tokenRecord) {
    throw new Error('User has not authorized Google Calendar');
  }

  // If the token is expired, refresh it
  if (new Date(tokenRecord.expiry_date) < new Date()) {
    const newTokens = await refreshAccessToken(userId);
    tokenRecord = await GoogleAuthToken.findOne({ where: { user_id: userId } });
  }

  oauth2Client.setCredentials({
    access_token: tokenRecord.access_token,
  });

  const calendarEvent = {
    summary: eventDetails.title,
    location: eventDetails.location,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startDateTime,
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: eventDetails.endDateTime,
      timeZone: 'America/Los_Angeles',
    },
    attendees: eventDetails.attendees, // Array of email addresses
  };

  const response = await calendar.events.insert({
    auth: oauth2Client,
    calendarId: 'primary',
    resource: calendarEvent,
  });

  return response.data;
}

module.exports = { getAuthUrl, getAccessToken, createEvent };
