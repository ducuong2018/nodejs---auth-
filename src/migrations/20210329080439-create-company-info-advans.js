'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Company_info_advanceds', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        unique:true
      },
      company_introduction:{
        type:Sequelize.JSONB
      },

      production_capacity: {
        type:Sequelize.JSONB
      },
      quality_control: {
        type:Sequelize.JSONB
      },
      certification: {
        type:Sequelize.JSONB
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.fn('now')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Company_info_advans');
  }
};
