const { Sequelize, DataTypes } = require("sequelize");
const mysql = require("mysql2/promise");

mysql
  .createConnection({
    user: process.env.USER,
    password: process.env.PASSWORD,
  })
  // Raw Queries to only create a database if not exist
  .then((connection) => {  
    connection.query("CREATE DATABASE IF NOT EXISTS contacts");
    connection.query("CREATE DATABASE IF NOT EXISTS global_users");
    connection.query("CREATE DATABASE IF NOT EXISTS registered_users");
  });

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.USER,
  process.env.PASSWORD,
  {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    pool: { max: 5, min: 0, idle: 10000 },
    logging: false
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
var { contacts } = require("../models/Contacts");

// Register User Table
db.registeredUsers = registeredUsers(sequelize, DataTypes);

// Global User Table
db.globalUsers = globalUsers(sequelize, DataTypes);

// Contact User Table
db.contacts = contacts(sequelize, DataTypes);

db.sequelize
  .sync()
  .then(function () {
    console.log("Tables Created Successfully");
  })
  .catch(function (err) {
    console.log("Error" + err);
  });

// Association - One To Many Relation

db.registeredUsers.hasMany(db.contacts, {
  foreignKey: "phoneNumber",
});

db.contacts.belongsTo(db.registeredUsers, {
  foreignKey: "phoneNumber",
});

module.exports = db;
