const express = require("express");
const router = express.Router();
const { getUsers, addUser } = require("../controller/usersController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");
const avatarUpload = require("../middleWares/users/avatarUpload");
const {
  addUserValidator,
  addUserValidationHandler,
} = require("../middleWares/users/userValidators");

//users page
router.get("/", decorateHtmlResponse("Users"), getUsers);

//add user
router.post(
  "/",
  avatarUpload,
  addUserValidator,
  addUserValidationHandler,
  addUser,
);

module.exports = router;
