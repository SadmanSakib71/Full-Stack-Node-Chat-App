const express = require("express");
const router = express.Router();
const { getLogIN, login } = require("../controller/loginController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");
const {
  doLoginValidators,
  doLoginValidationHandler,
} = require("../middleWares/login/loginValidators");

//set page title
const page_title = "Login";

//login page
router.get("/", decorateHtmlResponse(page_title), getLogIN);

//process login
router.post(
  "/",
  decorateHtmlResponse(page_title),
  doLoginValidators,
  doLoginValidationHandler,
  login,
);

module.exports = router;
