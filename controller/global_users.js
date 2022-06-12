const ErrorResponse = require("../utils/errorResponse");
const db = require("../config/db");
const globalUsers = db.globalUsers;

exports.register = async function (req, res, next) {
  try {
    const body = req.body;
    let data = await globalUsers.build(body);
    const user = await data.save();

    res.status(200).json({
      success: true,
      msg: "User Registered Successfully",
      daa: user,
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
