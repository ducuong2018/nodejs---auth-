'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique: true
      },
      phone_number:{
        type:Sequelize.STRING,
        unique: true
      },
      password_crypt:{
        type:Sequelize.STRING
      },
      confirmed_at:{
        type:Sequelize.DATE,
        timestamps: true
      },
      role:{
        type:Sequelize.ENUM,
        values: [
          'NORMAL', 'SELLER','BUYER'
        ],
        defaultValue: "NORMAL"

      },
      users_state:{
        type:Sequelize.STRING,

        defaultValue: "NON_ACTIVATED"
      },
      profile:{
        type:Sequelize.JSONB
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue:Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
        , defaultValue:Sequelize.fn('now')
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
