const ErrorResponse = require("../utils/errorResponse");
const db = require("../config/db");
const registeredUsers = db.registeredUsers;
const globalUsers = db.globalUsers;
const Sequelize = db.Sequelize;
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

    if (isNumberPresentGlobal.length === 0) {
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

exports.spam = async function (req, res, next) {
  try {
    const { phoneNumber } = req.body;

    const isNumberPresent = await globalUsers.findAll({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    if (isNumberPresent.length === 0) {
      return next(new ErrorResponse("Contact not exist"));
    }

    let spamCount = isNumberPresent[0].spamCount;
    spamCount += 1;

    const fieldsToUpdate = {
      spamCount: spamCount,
    };

    const user = await globalUsers.update(fieldsToUpdate, {
      where: {
        phoneNumber: phoneNumber,
      },
    });

    res.status(200).json({
      success: true,
      msg: "User added to spam list",
    });
  } catch (error) {
    return next(new ErrorResponse(message, 404));
  }
};

exports.search = async function (req, res) {
  const Op = Sequelize.Op;
  const searchTerm = req.body.searchTerm;
  try {
    const resp = await globalUsers.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: "%" + searchTerm + "%" } },
          { phoneNumber: { [Op.like]: "%" + searchTerm + "%" } }
        ],
      },
    });
    console.log(resp);
    res.status(200).send(resp);
  } catch (e) {
    res.status(400).send(e.message);
  }
};
