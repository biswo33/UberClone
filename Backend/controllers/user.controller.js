const e = require("express");
const userModel = require("../models/user.models");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blacklistTokenModel = require("../models/blacklistToken.model");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  const { fullname, email, password } = req.body;
  const isUserAlready = await userModel.findOne({ email });
  if (isUserAlready) {
    return res.status(400).json({ message: "User already exist" });
  }
  const hashedPassword = await userModel.hashPassword(password);
  const user = await userService.createUser({
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashedPassword,
  });
  const token = user.generateAuthToken();
  res.status(201).json({
    token,
    user,
  });
};

module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({
      message: "Invalid user",
    });
  }
  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    return res.status(401).json({
      message: "Incorrect Password",
    });
  }
  const token = user.generateAuthToken();
  return res.status(200).json({
    token: token,
    user: user,
  });
};
module.exports.getUserProfile = async function (req, res, next) {
  res.status(200).json(req.user);
};

module.exports.logOutUser = async function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  await blacklistTokenModel.create({ token });
  res.status(200).json({ message: "Logged Out" });
};
