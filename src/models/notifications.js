// models/Notification.js
module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('email', 'sms', 'push'),
        defaultValue: 'email',
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      timestamps: false,
      tableName: 'notifications',
    });
  
    Notification.associate = models => {
      // A notification belongs to a user
      Notification.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
      });
    };
  
    return Notification;
  };
  