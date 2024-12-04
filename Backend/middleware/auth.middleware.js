const userModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.authUser = async function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }
  const isBlackListed = await blacklistTokenModel.findOne({ token: token });
  if (isBlackListed) {
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }

  try {
    const deccoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findOne({ _id: deccoded._id });
    req.user = user;
    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: "Unauthorized user",
    });
  }
};
