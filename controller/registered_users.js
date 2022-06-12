const ErrorResponse = require("../utils/errorResponse");
const db = require("../config/db");
const registeredUsers = db.registeredUsers;
const globalUsers = db.globalUsers;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function sendTokenResponse(user, statusCode, res) {
  const token = getSignedJwtToken(user.id);
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token: token,
    data: user,
  });
}

function getSignedJwtToken(id) {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

exports.register = async function (req, res, next) {
  try {
    const body = req.body;
    
    const isNumberPresentGlobal = await globalUsers.findAll({
      where: {
        phoneNumber: body.phoneNumber,
      },
    });
    
    if(isNumberPresentGlobal.length === 0){
      let data = await globalUsers.build(body);
      await data.save();
    }

    const isPhoneNumberPresent = await registeredUsers.findAll({
      where: {
        phoneNumber: body.phoneNumber,
      },
    });

    if (isPhoneNumberPresent.length !== 0) {
      return next(new ErrorResponse("Phone Number already exists", 401));
    }

    const salt = await bcrypt.genSalt(10);
    body.password = await bcrypt.hash(body.password, salt);

    let data = await registeredUsers.build(body);
    const user = await data.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    const message = [];
    error.errors.forEach((e) => {
      message.push(e.message);
    });
    console.log(message);
    return next(new ErrorResponse(message, 404));
  }
};
