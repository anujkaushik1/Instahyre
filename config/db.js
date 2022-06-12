const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    pool: { max: 5, min: 0, idle: 10000 },
  }
);

sequelize
  .authenticate()
  .then(function () {
    console.log("Connection Established Successfully");
  })
  .catch(function (err) {
    console.log("Error : " + err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

var { registeredUsers } = require("../models/Registered_User");
var { globalUsers } = require("../models/Global_User");

// Register User Table
db.registeredUsers = registeredUsers(sequelize, DataTypes);

// Global User Table
db.globalUsers = globalUsers(sequelize, DataTypes);

db.sequelize
  .sync()
  .then(function () {
    console.log("Tables Created Successfully");
  })
  .catch(function (err) {
    console.log("Error" + err);
  });

module.exports = db;
