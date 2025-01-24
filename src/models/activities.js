// models/Activity.js
module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define('Activity', {
      activity_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      workshop_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'workshops',
          key: 'workshop_id',
        },
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      timestamps: false,
      tableName: 'activities',
    });
  
    Activity.associate = models => {
      // An activity belongs to a workshop
      Activity.belongsTo(models.Workshop, {
        foreignKey: 'workshop_id',
        as: 'workshop',
      });
    };
  
    return Activity;
  };
  