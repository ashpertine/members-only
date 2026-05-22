import { Router } from "express";
import { checkAuthentication } from "../middleware/auth.js";
import postsController from "../middleware/postsController.js";
import { body } from "express-validator";

const validatePost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("title must not be empty!")
    .isLength({ min: 3, max: 20 })
    .withMessage("title must be between 3 and 20 characters!"),
  body("content")
    .trim()
    .notEmpty()
    .withMessage("content field must not be empty!")
    .isLength({ min: 4, max: 300 })
    .withMessage("content field must be between 4 and 300 characters!"),
];

const postsRouter = Router();

postsRouter.get("/", postsController.postsView);
postsRouter.post("/new/post", validatePost, postsController.insertNewPost);
postsRouter.post("/delete/:postId", postsController.deletePost);

export { postsRouter };
