const express = require("express");
const router = express.Router();

router.post("/register", function (req, res) {
  res.send("User Registered Successfully");
});

module.exports = router;
