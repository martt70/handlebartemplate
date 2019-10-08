const Sequelize = require("sequelize");
const mysql = require("mysql");
const mysql2 = require("mysql2");
 
//Reading docs for queries using sequelize
//https://sequelize.readthedocs.io/en/v3/docs/models-usage/
 
//database wide options
var opts = {
  define: {
      //prevent sequelize from pluralizing table names
      freezeTableName: true
  }
}
 
//const db = {}
//const sequelize = new Sequelize("smalldata", "root", "love",{
 
//const db = new Sequelize("smalldata", "root", "love",{
 
    module.exports = new Sequelize("hurricane_dorian_assessment", "root", "love",{
   
    host: "localhost",
    dialect: "mysql",
    //operatorsAliases: false,
 
    pool: {
          max: 5,
            min: 0,
            acquire: 30000,
            idle: 90000
    }
})
/*
db.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
})
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});*/
/*
Sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    });
     
db.sequelize = sequelize
db.Sequelize = Sequelize
*/
 
//module.exports = db;