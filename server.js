const express = require("express");
const dotenv = require("dotenv");
const app = express();

// Loading Env Variables
dotenv.config({ path: "./config/config.env" });

// Route files
const registered_users = require("./routes/registered_users");

const PORT = process.env.PORT || 3000;
const API = process.env.API;

// Mounting Routes
app.use(API, registered_users)

app.listen(PORT, function () {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT} `
  );
});
