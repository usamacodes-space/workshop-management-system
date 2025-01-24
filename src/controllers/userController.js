const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword, 
      role_id 
    });

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email, roleId: user.role_id },
      secretKey,
      { expiresIn: '37d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token, // Include the token in the response
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Get authenticated user's details
exports.getUserDetails = async (req, res) => {
  try {
    // Extract userId from the token (middleware should set req.user)
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
};

// Update user preferences (e.g., notification opt-in/opt-out)
exports.updatePreferences = async (req, res) => {
  try {
    const { notifications_enabled } = req.body;

    console.log('Incoming notifications_enabled value:', notifications_enabled);

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Before update:', user.notification_opt_in);

    // Update the field
    user.notification_opt_in = notifications_enabled;
    await user.save();

    console.log('After update:', user.notification_opt_in);

    res.status(200).json({ message: 'Preferences updated successfully', user });
  } catch (error) {
    console.error('Update Preferences Error:', error.message);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};