const { Permission } = require('../models');

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.status(200).json(permissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch permissions' });
  }
};
