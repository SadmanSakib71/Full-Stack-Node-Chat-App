require("dotenv").config();

//external export
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("node:path");

//internal export
const {
  notFoundHandler,
  errorHandler,
} = require("./middleWares/common/errorHandler");
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

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
app.use("/", loginRouter);
app.use("/login", usersRouter);
app.use("/inbox", inboxRouter);

//404 error
app.use(notFoundHandler);

//error handling
app.use(errorHandler);

//port run
app.listen(process.env.Port, () => {
  console.log(`successfully running on port ${process.env.Port}`);
});
