'use strict';
module.exports = (sequelize, DataTypes) => {
  const tank_farm_unit_33s = sequelize.define('tank_farm_unit_33s', {
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
  tank_farm_unit_33s.associate = function(models) {
    // associations can be defined here
  };
  return tank_farm_unit_33s;
};