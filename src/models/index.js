// src/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Sequelize instance
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: true, // Set to true for logging queries
});

// Import individual models
const Workshop = require('./workshop')(sequelize, DataTypes);
const Activity = require('./activities')(sequelize, DataTypes);
const Enrollment = require('./enrollments')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const Notification = require('./notifications')(sequelize, DataTypes);
const Role = require('./roles')(sequelize, DataTypes);
const Permission = require('./permissions')(sequelize, DataTypes);

// Add associations between models here
Workshop.hasMany(Activity, { foreignKey: 'workshop_id' });
Activity.belongsTo(Workshop, { foreignKey: 'workshop_id' });

Workshop.hasMany(Enrollment, { foreignKey: 'workshop_id' });
Enrollment.belongsTo(Workshop, { foreignKey: 'workshop_id' });

User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });
console.log(Workshop.associations);
console.log(Activity.associations);

// Export models and Sequelize instance
const db = {
  sequelize,
  Sequelize,
  Workshop,
  Activity,
  Enrollment,
  User,
  Notification,
  Role,
  Permission,
};

module.exports = db;
