function decorateHtmlResponse(pageTitle) {
  return function (req, res, next) {
    res.locals.html = true;
    res.locals.title = `${pageTitle} - ${process.env.App_Name}`;
    next();
  };
}

module.exports = decorateHtmlResponse;
