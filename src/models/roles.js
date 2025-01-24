// models/Role.js
module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('Role', {
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      timestamps: false,
      tableName: 'roles',
    });
  
    Role.associate = models => {
      // A role can have many users
      Role.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'users',
      });
      // A role can have many permissions
      Role.hasMany(models.Permission, {
        foreignKey: 'role_id',
        as: 'permissions',
      });
    };
  
    return Role;
  };
  