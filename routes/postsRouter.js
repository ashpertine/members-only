import { Router } from "express";
import { checkAuthentication } from "../middleware/auth.js";
import postsController from "../middleware/postsController.js";

const postsRouter = Router();

postsRouter.get("/", postsController.postsView);
postsRouter.post("/new/post", postsController.insertNewPost);

export { postsRouter };
