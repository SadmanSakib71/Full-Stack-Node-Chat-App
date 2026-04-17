const express = require("express");
const router = express.Router();
const { getUsers } = require("../controller/usersController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");

//users page
router.get("/", decorateHtmlResponse("Users"), getUsers);

//add user
router.post;

module.exports = router;
