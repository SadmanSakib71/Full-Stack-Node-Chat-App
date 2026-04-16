require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("node:path");

const app = express();

//request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect with database
mongoose
  .connect(process.env.MongoDb_Connection)
  .then(() => {
    console.log("Connected with database successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//set view engine
app.set("view engine", "ejs");

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//cookie parser
app.use(cookieParser(process.env.Cookie_secret));

//routing setup

//error handling

//port run
app.listen(process.env.Port, () => {
  console.log(`successfully running on port ${process.env.Port}`);
});
