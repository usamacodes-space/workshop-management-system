'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('enrollments', 'user_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'user_id',
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('enrollments', 'user_id');
  }
};
