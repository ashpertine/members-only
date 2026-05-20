import authQueries from "../queries/authQueries.js";
import postsQueries from "../queries/postsQueries.js";

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
    if (currentUserId !== undefined) {
      const results = await authQueries.getUserById(currentUserId);
      username = results.username;
      isAdmin = results.is_admin;
    }

    if (!isAdmin && !noPosts) {
      for (const post of allPosts) {
        if (post.username !== username) {
          post.username = "******";
        }
      }
    }

    res.render("posts", {
      currentUser: username ?? "unknown guest",
      allPosts: allPosts,
      noUser: currentUserId ? false : true,
      noPosts: noPosts,
      isAdmin: isAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}

async function insertNewPost(req, res) {
  const currentUserId = req.session.passport.user;
  const title = req.body.title;
  const content = req.body.content;
  try {
    await postsQueries.newPost(currentUserId, title, content);
    return res.redirect("/");
  } catch (error) {
    res.status(500).json(error);
  }
}

export default {
  postsView,
  insertNewPost,
};
