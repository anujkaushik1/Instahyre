const fs = require("fs");
const dotenv = require("dotenv");

// Loading Env Variables
dotenv.config({ path: "./config/config.env" });

// Load Models

const db = require("./config/db");
const globalUsers = db.globalUsers;

// Read JSON Files
const registered_users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/global_users.json`, "utf-8")
);

// Import into DB
const importData = async function () {
  try {
    await globalUsers.bulkCreate(registered_users);

    console.log("Data Imported...");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete Data
const deleteData = async function () {
  try {
    await globalUsers.destroy({
      where: {},
    });

    console.log("Data Destroyed...");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}