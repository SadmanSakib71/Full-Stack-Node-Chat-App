const express = require("express");
const router = express.Router();
const { getInbox } = require("../controller/inboxController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");
const { checkLogin } = require("../middleWares/common/checkLogIn");

//inbox page
router.get("/", decorateHtmlResponse("Inbox"), checkLogin, getInbox);

module.exports = router;
