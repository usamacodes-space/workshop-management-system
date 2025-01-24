// models/Permission.js
module.exports = (sequelize, DataTypes) => {
    const Permission = sequelize.define('Permission', {
      permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'roles',
          key: 'role_id',
        },
      },
      permission: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      timestamps: false,
      tableName: 'permissions',
    });
  
    Permission.associate = models => {
      // A permission belongs to a role
      Permission.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });
    };
  
    return Permission;
  };
  