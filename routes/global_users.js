const express = require("express");
const router = express.Router();
const {register, oneToOne} = require('../controller/global_users');

router.post("/register", register);
module.exports = router;
