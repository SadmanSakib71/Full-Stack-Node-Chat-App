const express = require("express");
const router = express.Router();
const { getUsers } = require("../controller/usersController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");
const avatarUpload = require("../middleWares/users/avatarUpload");
const { addUserValidator } = require("../middleWares/users/userValidators");

//users page
router.get("/", decorateHtmlResponse("Users"), getUsers);

//add user
router.post("/", avatarUpload, addUserValidator);

module.exports = router;
