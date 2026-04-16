//get login page
function getUsers(req, res, next) {
  res.render("users", {
    title: "Login - chat application",
  });
}

module.exports = {
  getUsers,
};
