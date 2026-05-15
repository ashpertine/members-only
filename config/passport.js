import passport from "passport";
import LocalStrategy from "passport-local";
import { appPool } from "../db/pool.js";
import { validPassword } from "../utils/passwordUtils.js";

const verifyCallback = async (username, password, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    const user = rows[0];
    if (!user) {
      return done(null, false, { message: "Invalid Username or Password" });
    }

    if (validPassword(password, user.password)) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Invalid Username or Password" });
    }
  } catch (error) {
    return done(error);
  }
};

passport.use(new LocalStrategy(verifyCallback));

passport.serailizeUser((user, done) => {
  return done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
  try {
    const { rows } = await appPool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [user_id],
    );

    const user = rows[0];
    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
});
