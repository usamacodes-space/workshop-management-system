const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Authentication Middleware
exports.authenticate = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1]; // Expecting "Bearer <token>"
    console.log('Token:', token);
    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ error: 'Access token is missing or invalid' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Debug: Log decoded payload

    // Fetch the user from the database
    const user = await User.findByPk(decoded.userId); // Match decoded userId with User's primary key
    console.log('Fetched User:', user ? user.toJSON() : 'No user found'); // Debug: Log user details

    if (!user) {
      console.error(`User not found for userId: ${decoded.userId}`);
      return res.status(401).json({ error: 'User not found or unauthorized' });
    }

    // Attach user details to the request object
    req.user = {
      userId: user.user_id,
      roleId: user.role_id, // Ensure these fields match the database schema
    };
    console.log('User attached to request:', req.user);

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Invalid token or authorization error' });
  }
};

// Authorization Middleware
exports.authorize = (requiredRoles) => {
  return (req, res, next) => {
    try {
      const { roleId } = req.user; // Extract roleId from the attached user object
      console.log('User Role ID:', roleId); // Debugging log
      console.log('Required Roles:', requiredRoles); // Debugging log

      // Compare roleId against required roles
      if (!requiredRoles.includes(roleId)) {
        console.error(`Role mismatch: user roleId (${roleId}) not in required roles`);
        return res.status(403).json({ error: 'You do not have permission to perform this action' });
      }

      next(); // Proceed if the role matches
    } catch (error) {
      console.error('Authorization error:', error.message);
      res.status(403).json({ error: 'Authorization error' });
    }
  };
};
