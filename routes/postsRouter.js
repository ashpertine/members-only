import { Router } from "express";
import { checkAuthentication } from "../middleware/auth.js";

const postsRouter = Router();

postsRouter.use(checkAuthentication);

postsRouter.get("/", (req, res) => {
  res.render("posts");
});

export { postsRouter };
