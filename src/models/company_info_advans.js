'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company_info_advans extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company_info_advans.belongsTo(models.Users,{
        foreignKey:"id",
      });
      models. Users.hasMany(Company_info_advans,{
        foreignKey:"id",
      });
    }
  };
  Company_info_advans.init({
    company_introduction:DataTypes.JSONB,
    production_capacity: DataTypes.JSONB,
    quality_control: DataTypes.JSONB,
    certification:DataTypes.JSONB,
  }, {
    sequelize,
    modelName: 'Company_info_advanceds',
  });

  return Company_info_advans;
};
