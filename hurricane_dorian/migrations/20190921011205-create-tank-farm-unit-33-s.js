'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tank_farm_unit_33s', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      equipment_area: {
        type: Sequelize.STRING
      },
      equipment_type: {
        type: Sequelize.STRING
      },
      photo_image: {
        type: Sequelize.STRING
      },
      manufacturer: {
        type: Sequelize.STRING
      },
      model_number: {
        type: Sequelize.STRING
      },
      serial_number: {
        type: Sequelize.STRING
      },
      service: {
        type: Sequelize.STRING
      },
      capacity: {
        type: Sequelize.STRING
      },
      severity: {
        type: Sequelize.STRING
      },
      general_comments: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tank_farm_unit_33s');
  }
};