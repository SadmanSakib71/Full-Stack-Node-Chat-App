const express = require("express");
const router = express.Router();
const { getUsers } = require("../controller/usersController");

//users page
router.get("/", getUsers);

module.exports = router;
