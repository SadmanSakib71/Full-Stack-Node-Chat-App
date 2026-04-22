// imports
const express = require("express");
const router = express.Router();
const {
  getLogIN,
  getRegister,
  registerUser,
  login,
  logOut,
} = require("../controller/loginController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require("../middleWares/login/loginValidators");
const {
  checkLogin,
  redirectLoggedIn,
} = require("../middleWares/common/checkLogIn");
const avatarUpload = require("../middleWares/users/avatarUpload");
const {
  addUserValidator,
  addUserValidationHtmlHandler,
} = require("../middleWares/users/userValidators");

//set page title
const page_title = "Login";

//login page
router.get("/", decorateHtmlResponse(page_title), redirectLoggedIn, getLogIN);

// register page
const register_page_title = "Register";
router.get(
  "/register",
  decorateHtmlResponse(register_page_title),
  redirectLoggedIn,
  getRegister,
);

// process registration (same fields & validation as POST /users)
router.post(
  "/register",
  decorateHtmlResponse(register_page_title),
  avatarUpload,
  addUserValidator,
  addUserValidationHtmlHandler,
  registerUser,
);

//process login
router.post(
  "/",
  decorateHtmlResponse(page_title),
  doLoginValidators,
  doLoginValidationHandler,
  login,
);

//process logout
router.delete("/", logOut);

module.exports = router;
