const ErrorResponse = require("../utils/errorResponse");
const db = require("../config/db");
const registeredUsers = db.registeredUsers;
const bcrypt = require("bcryptjs");
const { format } = require("path");
const { use } = require("../routes/registered_users");
exports.register = async function (req, res, next) {
  try {
    const body = req.body;

    const isPhoneNumberPresent = await registeredUsers.findAll({
      where: {
        phoneNumber: body.phoneNumber,
      },
    });

    if (isPhoneNumberPresent) {
      return next(new ErrorResponse("Phone Number already exists", 401));
    }

    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);

    let data = await registeredUsers.build(body);
    const user = await data.save();

    return res.status(200).json({
      success: true,
      msg: "User Registered Successfully",
      data: user,
    });
  } catch (error) {
      const message = [];
      error.errors.forEach((e) => {
        message.push(e.message);
      });
      console.log(message);
      return next(new ErrorResponse(message, 404));
    
  }
};
