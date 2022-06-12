const express = require("express");
const router = express.Router();
const { register, test } = require("../controller/registered_users");
const { protect } = require("../middleware/auth");

router.post("/register", register);

module.exports = router;
