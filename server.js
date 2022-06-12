const express = require("express");
const dotenv = require("dotenv");
const errorHandler = require("./middleware/error");
const app = express();

// Body Parser
app.use(express.json());

// Loading Env Variables
dotenv.config({ path: "./config/config.env" });

// Route files
const registered_users = require("./routes/registered_users");
const global_users = require('./routes/global_users');

const PORT = process.env.PORT || 3000;

// Mounting Routes
app.use("/api/v1/users", registered_users);
app.use("/api/v1/global", global_users);

app.use(errorHandler);

app.listen(PORT, function () {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT} `
  );
});
