const express = require("express");
const router = express.Router();
const { getLogIN, login } = require("../controller/loginController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");

//login page
router.get("/", decorateHtmlResponse("Login"), getLogIN);

//process login
router.post("/", login);

module.exports = router;
