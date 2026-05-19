import express from "express";
import path from "path";
import session from "express-session";
import passport from "passport";
import connectPgSimple from "connect-pg-simple";
import { appPool } from "./db/pool.js";
import { postsRouter } from "./routes/postsRouter.js";
import { authRouter } from "./routes/authRouter.js";

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

app.use("/", postsRouter);
app.use("/auth", authRouter);

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Server is running on Port 3000`);
});
