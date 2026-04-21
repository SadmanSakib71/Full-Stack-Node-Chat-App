// external imports
const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const moment = require("moment");

// internal imports
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const inboxRouter = require("./router/inboxRouter");

// internal imports
const {
  notFoundHandler,
  errorHandler,
} = require("./middleWares/common/errorHandler");

const app = express();
const server = http.createServer(app);
// Do not override env vars already set by the host (e.g. Railway)
dotenv.config({ override: false });

// socket creation
const io = require("socket.io")(server);
global.io = io;

io.on("connection", (socket) => {
  const raw = socket.handshake.query.userId;
  const userId = Array.isArray(raw) ? raw[0] : raw;
  if (userId) {
    socket.join(String(userId));
  }
});

// set comment as app locals
app.locals.moment = moment;

// database connection — Railway Mongo uses MONGO_URL; your .env may use MongoDb_Connection
const mongoUri =
  process.env.MongoDb_Connection ||
  process.env.MONGO_URL ||
  process.env.DATABASE_URL;
if (!mongoUri) {
  console.error(
    "Missing MongoDB URI: set MongoDb_Connection, MONGO_URL, or DATABASE_URL on the app service (or in .env for local dev).",
  );
} else {
  mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected with database successfully");
    })
    .catch((err) => {
      console.log(err);
    });
}

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// parse cookies
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup
app.use("/", loginRouter);
app.use("/users", usersRouter);
app.use("/inbox", inboxRouter);

// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";
server.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`);
});
