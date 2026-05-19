import { Router } from "express";
import { checkAuthentication } from "../middleware/auth.js";
import authController from "../middleware/authController.js";
import passport from "passport";

const authRouter = Router();

authRouter.get("/login", authController.loginUserView);
authRouter.get("/register", authController.registerUserView);

authRouter.post("/register", authController.registerUserPost);
authRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.session.loginError = info.message;
      return res.redirect("/auth/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});

authRouter.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export { authRouter };
