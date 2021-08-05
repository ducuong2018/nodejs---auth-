'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  };
  Users.init({
    email: DataTypes.STRING,
    phone_number:DataTypes.STRING,
    password_crypt:DataTypes.STRING,
    confirmed_at:DataTypes.DATE,
    role:DataTypes.ENUM('NORMAL', 'SELLER','BUYER'),
    users_state:DataTypes.ENUM('NON_ACTIVATED', 'ACTIVATED', 'BANNED'),
    profile:DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};
