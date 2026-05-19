import authQueries from "../queries/authQueries.js";

async function registerUserPost(req, res) {
  try {
    const results = await authQueries.getUserByUsername(req.body.username);
    if (results.length > 0) {
      return res.render("register", {
        registerError: "username already exists!",
      });
    }
    await authQueries.addNewUser(req.body.username, req.body.password);
    res.redirect("/auth/login");
  } catch (error) {
    res.status(500).json(error);
  }
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
  res.render("register", { registerError: false });
}

export default {
  registerUserPost,
  loginUserView,
  registerUserView,
};
