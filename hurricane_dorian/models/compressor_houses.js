'use strict';
module.exports = (sequelize, DataTypes) => {
  const compressor_houses = sequelize.define('compressor_houses', {
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
  compressor_houses.associate = function(models) {
    // associations can be defined here
    //compressor_houses.hasMany(models.boiler_houses, {
     // foreignKey: 'second_compressor_id',
     //  });
     };
  
  return compressor_houses;
};