'use strict';
module.exports = (sequelize, DataTypes) => {
  const hfo_separators = sequelize.define('hfo_separators', {
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
  hfo_separators.associate = function(models) {
    // associations can be defined here
  };
  return hfo_separators;
};