'use strict';
module.exports = (sequelize, DataTypes) => {
  const fire_houses = sequelize.define('fire_houses', {
    equipment_area: DataTypes.STRING,
    equipment_type: DataTypes.STRING,
    photo_image: DataTypes.STRING,
    manufacturer: DataTypes.STRING,
    model_number: DataTypes.STRING,
    serial_number: DataTypes.STRING,
    service: DataTypes.STRING,
    capacity: DataTypes.STRING,
    severity: DataTypes.STRING,
    general_comments: DataTypes.STRING
  }, {});
  fire_houses.associate = function(models) {
    // associations can be defined here
  };
  return fire_houses;
};