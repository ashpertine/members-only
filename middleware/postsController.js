import authQueries from "../queries/authQueries.js";
import postsQueries from "../queries/postsQueries.js";
import { body, validationResult, matchedData } from "express-validator";

async function postsView(req, res) {
  const allPosts = await postsQueries.getAllPosts();
  let noPosts = false;
  if (allPosts.length === 0) {
    noPosts = true;
  }

  try {
    const currentUserId = req.session.passport?.user;
    let username = null;
    let isAdmin = false;
    let isMember = false;
    if (currentUserId !== undefined) {
      const results = await authQueries.getUserById(currentUserId);
      username = results.username;
      isAdmin = results.is_admin;
      isMember = results.is_member;
    }

    if (!isMember && !noPosts) {
      for (const post of allPosts) {
        if (post.username !== username) {
          post.username = "******";
        }
      }
    }

    let postInputErrors = [];
    if (req.session.postInputErrors !== undefined) {
      postInputErrors = req.session.postInputErrors;
      delete req.session.postInputErrors;
    }

    res.render("posts", {
      currentUser: username ?? "unknown guest",
      allPosts: allPosts,
      noUser: currentUserId ? false : true,
      noPosts: noPosts,
      isMember: isMember,
      isAdmin: isAdmin,
      postInputErrors: postInputErrors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

async function insertNewPost(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsArr = errors.array();
    req.session.postInputErrors = errorsArr;
    return res.redirect("/");
  }
  const currentUserId = req.session.passport.user;
  const data = matchedData(req);
  try {
    await postsQueries.newPost(currentUserId, data.title, data.content);
    return res.redirect("/");
  } catch (error) {
    res.status(500).json(error);
  }
}

async function deletePost(req, res) {
  const postId = req.params.postId;
  try {
    await postsQueries.deletePostById(postId);
    res.redirect("/");
  } catch (error) {
    res.status(500).json(error);
  }
}

export default {
  postsView,
  insertNewPost,
  deletePost,
};
