const express = require("express");
const router = express.Router();
const { register } = require("../controller/registered_users");

router.post("/register", register);

module.exports = router;
