const express = require("express");
const router = express.Router();
const { getLogIN } = require("../controller/loginController");

//login page
router.get("/", getLogIN);

module.exports = router;
