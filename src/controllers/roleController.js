const { Role } = require('../models');

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const role = await Role.create({ name });
    res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create role' });
  }
};

// Fetch all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};
