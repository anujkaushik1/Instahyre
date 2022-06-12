const express = require("express");
const router = express.Router();
const { register, spam, search } = require("../controller/registered_users");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.put("/spam", protect, spam);
router.post("/searchspam", protect, search);

module.exports = router;
