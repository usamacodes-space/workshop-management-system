module.exports = (sequelize, DataTypes) => {
  const Enrollment = sequelize.define('Enrollment', {
    enrollment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {  // Updated to user_id to match the `users` table column
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'user_id',
      },
    },
    workshop_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'workshops',
        key: 'workshop_id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
  }, {
    timestamps: false,
    tableName: 'enrollments',
  });

  Enrollment.associate = models => {
    // An enrollment belongs to a learner (user)
    Enrollment.belongsTo(models.User, {
      foreignKey: 'user_id',  // Updated to user_id to match the `users` table column
      as: 'learner',
    });
    // An enrollment belongs to a workshop
    Enrollment.belongsTo(models.Workshop, {
      foreignKey: 'workshop_id',
      as: 'workshop',
    });
  };

  return Enrollment;
};
