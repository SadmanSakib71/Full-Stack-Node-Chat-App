const createError = require("http-errors");

//404 not found
const notFoundHandler = (req, res, next) => {
  next(createError(404, "Your requested content was not found"));
};

//error handler
const errorHandler = (err, req, res, next) => {
  res.render("error", {
    title: "Error page",
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
