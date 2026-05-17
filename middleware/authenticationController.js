import authenticationQueries from "../queries/authenticationQueries.js";

async function registerUserPost(req, res) {
  await authenticationQueries.addNewUser(req.body.username, req.body.password);
  res.redirect("/login");
}

// GET Routes
async function loginUserView(req, res) {
  if (req.session.loginError) {
    const loginError = req.session.loginError;
    delete req.session.loginError;
    return res.render("login", { loginError });
  }

  res.render("login");
}

async function registerUserView(req, res) {
  res.render("register");
}
export default {
  registerUserPost,
  loginUserView,
  registerUserView,
};
