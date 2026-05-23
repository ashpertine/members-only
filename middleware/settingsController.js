import settingsQueries from "../queries/settingsQueries.js";
import authQueries from "../queries/authQueries.js";
import { validPassword } from "../utils/passwordUtils.js";

async function settingsView(req, res) {
  const userId = req.session.passport.user;
  const results = await authQueries.getUserById(userId);
  const settingsError = req.session.settingsError ?? false;
  if (req.session.settingsError !== undefined) delete req.session.settingsError;
  res.render("settings", {
    userId: userId,
    isMember: results.is_member,
    isAdmin: results.is_admin,
    settingsError: settingsError,
  });
}

async function verifyAdmin(req, res, next) {
  const userId = req.session.passport.user;
  const newIsAdmin = Boolean(req.body.is_admin_setting);
  const oldIsAdmin = await settingsQueries.isUserAdmin(userId);
  const verifiedPassword = req.body.verified_password ?? false;
  if (newIsAdmin !== oldIsAdmin && verifiedPassword) {
    // verify
    const user = await authQueries.getUserById(userId);
    const userPasswordHashed = user.password;
    const isMatch = await validPassword(verifiedPassword, userPasswordHashed);
    if (!isMatch) {
      req.session.settingsError = "Invalid Password!";
      return res.redirect("/settings");
    }
  } else if (newIsAdmin !== oldIsAdmin && !verifiedPassword) {
    req.session.settingsError = "Enter your password to modify admin setting.";
    return res.redirect("/settings");
  }

  res.locals.newIsAdmin = newIsAdmin;
  next();
}

async function updateUserConfig(req, res) {
  const userId = req.session.passport.user;
  const newIsMember = Boolean(req.body.is_member_setting);
  const newIsAdmin = res.locals.newIsAdmin;
  await settingsQueries.saveUserConfig(userId, newIsMember, newIsAdmin);
  res.redirect("/");
}

export default {
  settingsView,
  verifyAdmin,
  updateUserConfig,
};
