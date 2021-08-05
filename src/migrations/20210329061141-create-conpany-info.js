'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Company_infos', {
      id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        unique:true,
      },
      name: {
        type: Sequelize.STRING
      },
      registered_business_address:{
        type:Sequelize.JSONB
      },
      web_site:{
        type:Sequelize.STRING
      },
      working_address:{
        type:Sequelize.JSONB
      },
      state:{
        type:Sequelize.ENUM("NON_VERIFIED","VERIFIED"),
        defaultValue:"NON_VERIFIED"
      },
      business_code:{
        type:Sequelize.STRING
      },
      image_items:{
        type:Sequelize.JSONB,
      },
      main_items:{
        type:Sequelize.ARRAY(Sequelize.STRING),
      },
      founded_year:{
        type:Sequelize.DATE
      },
      company_size:{
        type:Sequelize.STRING
      },
      name_representative:{
        type:Sequelize.STRING
      },
      description:{
        type:Sequelize.STRING
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
    await queryInterface.dropTable('conpany_infos');
  }
};
