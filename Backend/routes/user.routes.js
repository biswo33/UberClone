const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Inviald Email"),
    body("fullname.firstname")
      .isLength({ min: 3 })
      .withMessage("firstname should be of 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("password must be above 6 characters"),
  ],
  userController.registerUser
);
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a vaid login"),
    body("password").isLength({ min: 6 }).withMessage("wrong password"),
  ],
  userController.loginUser
);
router.get("/profile", authMiddleware.authUser, userController.getUserProfile);
router.get("/logout", authMiddleware.authUser, userController.logOutUser);
module.exports = router;
