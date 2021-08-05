'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company_info.belongsTo(models.Users,{
        foreignKey:"id",
      });
      models. Users.hasMany(Company_info,{
          foreignKey:"id",
      });
    }
  };
  Company_info.init({
    name: DataTypes.STRING,
    web_site:DataTypes.STRING,
    registered_business_address:DataTypes.JSONB,
    working_address:DataTypes.JSONB,
    state:DataTypes.ENUM("NON_VERIFIED","VERIFIED"),
    business_code: DataTypes.STRING,
    image_items:DataTypes.JSONB,
    main_items:DataTypes.ARRAY(DataTypes.STRING),
    founded_year:DataTypes.DATE,
    company_size:DataTypes.STRING,
    name_representative:DataTypes.STRING,
    description:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Company_infos',
  });

  return Company_info;
};
