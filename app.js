import express from "express";
import path from "path";
import session from "express-session";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
import { appPool } from "./db/pool.js";
import authenticationController from "./middleware/authenticationController.js";
import { postsRouter } from "./routes/postsRouter.js";

const __dirname = import.meta.dirname;
const pgSession = connectPgSimple(session);

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new pgSession({
      pool: appPool,
    }),
    secret: process.env.APP_COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());
import "./config/passport.js";

app.get("/login", authenticationController.loginUserView);
app.get("/register", authenticationController.registerUserView);

app.use("/posts", postsRouter);

app.post("/register", authenticationController.registerUserPost);
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.session.loginError = info.message;
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/posts");
    });
  })(req, res, next);
});

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server is running on Port 3000`);
});
