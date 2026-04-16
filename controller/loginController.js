//get login page
function getLogIN(req, res, next) {
  res.render("index", {
    title: "Login - chat application",
  });
}

module.exports = {
  getLogIN,
};
