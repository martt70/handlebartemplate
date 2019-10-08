'use strict';
module.exports = (sequelize, DataTypes) => {
  const boiler_houses = sequelize.define('boiler_houses', {
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
  boiler_houses.associate = function(models) {
        // associations can be defined here
  //boiler_houses.hasMany(models.compressor_houses, {
   // foreignKey: 'second_boiler_id',
    // });
    };
    return boiler_houses;
};