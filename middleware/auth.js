const jwt = require("jsonwebtoken");
const db = require("../config/db");
const registeredUsers = db.registeredUsers;

// Protect Routes
exports.protect = async function (req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      msg: "Not authorized to access the route",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.headers['id'] = decoded.id;
  
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};