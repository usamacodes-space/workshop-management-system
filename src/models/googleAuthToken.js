module.exports = (sequelize, DataTypes) => {
    const GoogleAuthToken = sequelize.define('GoogleAuthToken', {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  
    return GoogleAuthToken;
  };
  