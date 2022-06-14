const { Sequelize, DataTypes } = require("sequelize");
const mysql = require("mysql2/promise");

 const startUp =  async () => {
  try {
    const connection = await mysql.createConnection({
      user: process.env.USER,
      password: process.env.PASSWORD,
    });
  
    connection.query("CREATE DATABASE IF NOT EXISTS global_database");
    const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.USER,
      process.env.PASSWORD,
      {
        host: process.env.HOST,
        dialect: process.env.DIALECT,
        pool: { max: 5, min: 0, idle: 10000 },
        logging: false,
      }
    );
  
    await sequelize.authenticate();
    console.log("Connection Established Successfully");
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
  
    await db.sequelize.sync();
    console.log("Tables Created Successfully");
    
    return db;

  } catch (error) {
    console.log(error);
  }

};

module.exports = startUp();
