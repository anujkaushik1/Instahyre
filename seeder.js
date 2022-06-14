const fs = require("fs");
const dotenv = require("dotenv");
// Loading Env Variables
dotenv.config({ path: "./config/config.env" });

// Load Models

const seeder = async () => {
  const startUp = require("./config/db");
  const db = await startUp;

  const globalUsers = db.globalUsers;
  const contacts = db.contacts;

  // Read JSON Files
  const registered_users = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/global_users.json`, "utf-8")
  );

  const contact_file = JSON.parse(
    fs.readFileSync(`${__dirname}/_data/contacts.json`, "utf-8")
  );

  // Import into DB
  const importData = async function () {
    try {
      await globalUsers.bulkCreate(registered_users);
      await contacts.bulkCreate(contact_file);
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

      await contacts.destroy({
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
};

seeder();
