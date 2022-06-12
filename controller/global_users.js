const ErrorResponse = require("../utils/errorResponse");
const db = require("../config/db");
const globalUsers = db.globalUsers;

// @desc      Register user
// @route     POST /api/v1/global/register
// @access    Public

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
    return next(new ErrorResponse(error, 404));
  }
};
