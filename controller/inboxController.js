//get login page
function getInbox(req, res, next) {
  res.render("inbox", {
    title: "Login - chat application",
  });
}

module.exports = {
  getInbox,
};
