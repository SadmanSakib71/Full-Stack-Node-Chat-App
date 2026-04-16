const express = require("express");
const router = express.Router();
const { getLogIN } = require("../controller/loginController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");

//login page
router.get("/", decorateHtmlResponse("Login"), getLogIN);

module.exports = router;
