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

    if(!body.password){
      return next(new ErrorResponse("Please enter password", 401));
    }

    if(!body.phoneNumber){
      return next(new ErrorResponse("Please enter phone number", 401));
    }

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
    return next(new ErrorResponse(error, 404));
  }
};

exports.spam = async function (req, res, next) {
  try {
    const { phoneNumber } = req.body;

    if(!phoneNumber){
      return next(new ErrorResponse("Please enter phone number", 401));
    }

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

exports.searchByName = async function (req, res, next) {
  try {
    const Op = Sequelize.Op;
    const searchTerm = req.body.search;

    if(!searchTerm){
      return next(new ErrorResponse("Please enter name", 401));
    }
    const resp = await globalUsers.findAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: "%" + searchTerm + "%" } }],
      },
    });

    let results = [];
    for (let i = 0; i < resp.length; i++) {
      results.push(resp[i].dataValues);
    }

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (e) {
    return next(new ErrorResponse(e.message, 404));
  }
};

exports.searchByPhone = async function (req, res, next) {
  try {
    const Op = Sequelize.Op;
    const searchTerm = req.body.search;

    if(!searchTerm){
      return next(new ErrorResponse("Please enter phone number", 401));
    }

    const isPhoneNumberPresent = await registeredUsers.findAll({
      where: {
        phoneNumber: searchTerm,
      },
    });

    if (isPhoneNumberPresent.length > 0) {
      return res.status(200).json({
        success: true,
        data: isPhoneNumberPresent[0].dataValues,
      });
    }
    const resp = await globalUsers.findAll({
      where: {
        [Op.or]: [{ phoneNumber: { [Op.like]: "%" + searchTerm + "%" } }],
      },
    });

    let results = [];
    for (let i = 0; i < resp.length; i++) {
      results.push(resp[i].dataValues);
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (e) {
    return res.status(400).send(e.message);
  }
};

exports.getMetaUserData = async function (req, res, next) {
  try {
    const id = req.params.id;
    const globalData = await globalUsers.findAll({
      where: {
        id: id,
      },
    });

    if (globalData.length === 0) {
      return next(
        new ErrorResponse("Please enter correct id of global user", 404)
      );
    }

    const phoneNumber = globalData[0].dataValues.phoneNumber;
    const registeredData = await registeredUsers.findAll({
      where: {
        phoneNumber: phoneNumber,
      },
    });

    let results = {
      name: globalData[0].dataValues.name,
      phoneNumber: globalData[0].dataValues.phoneNumber,
      spamCount: globalData[0].dataValues.spamCount,
    };

    if (registeredData.length > 0) {
      results.email = registeredData[0].dataValues.email;
      results.name = registeredData[0].dataValues.name;   
    }

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    return next(new ErrorResponse(error.message, 404));
  }
};
