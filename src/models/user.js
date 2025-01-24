// models/User.js
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'role_id',
        },
      },
      notification_opt_in: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      timestamps: false,
      tableName: 'users',
    });
  
    User.associate = models => {
      // A user belongs to a role
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });
  
      // A user (mentor) can create many workshops
      User.hasMany(models.Workshop, {
        foreignKey: 'mentor_id',
        as: 'createdWorkshops',
      });
  
      // A user (learner) can have many enrollments
      User.hasMany(models.Enrollment, {
        foreignKey: 'learner_id',
        as: 'enrollments',
      });
  
      // A user can have many notifications
      User.hasMany(models.Notification, {
        foreignKey: 'user_id',
        as: 'notifications',
      });
    };
  
    return User;
  };
  