const express = require("express");
const router = express.Router();
const {
  register,
  spam,
  searchByName,
  searchByPhone,
  getMetaUserData,
} = require("../controller/registered_users");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.put("/spam", protect, spam);
router.post("/searchbyname", protect, searchByName);
router.post("/searchbyphone", protect, searchByPhone);
router.get("/:id", protect, getMetaUserData);

module.exports = router;
