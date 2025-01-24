// models/Workshop.js
module.exports = (sequelize, DataTypes) => {
    const Workshop = sequelize.define('Workshop', {
      workshop_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(150),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      mentor_id: {
        type: DataTypes.INTEGER,
        references: {
          model: 'users',
          key: 'user_id',
        },
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }, {
      timestamps: false,
      tableName: 'workshops',
    });
  
    Workshop.associate = models => {
      // A workshop belongs to a mentor
      Workshop.belongsTo(models.User, {
        foreignKey: 'mentor_id',
        as: 'mentor',
      });
      // A workshop can have many activities
      Workshop.hasMany(models.Activity, {
        foreignKey: 'workshop_id',
        as: 'activities',
      });
      // A workshop can have many enrollments
      Workshop.hasMany(models.Enrollment, {
        foreignKey: 'workshop_id',
        as: 'enrollments',
      });
    };
  
    return Workshop;
  };
  