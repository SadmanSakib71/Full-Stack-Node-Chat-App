const express = require("express");
const router = express.Router();
const {
  getUsers,
  addUser,
  removeUser,
} = require("../controller/usersController");
const decorateHtmlResponse = require("../middleWares/common/decorateHtmlResponse");
const { checkLogin, requireRole } = require("../middleWares/common/checkLogIn");
const avatarUpload = require("../middleWares/users/avatarUpload");
const {
  addUserValidator,
  addUserValidationHandler,
} = require("../middleWares/users/userValidators");

//users page
router.get(
  "/",
  decorateHtmlResponse("Users"),
  checkLogin,
  requireRole(["admin"]),
  getUsers,
);

//add user
router.post(
  "/",
  checkLogin,
  requireRole(["admin"]),
  avatarUpload,
  addUserValidator,
  addUserValidationHandler,
  addUser,
);

//remove user
router.delete("/:id", checkLogin, requireRole(["admin"]), removeUser);

module.exports = router;
