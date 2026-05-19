import postsQueries from "../queries/postsQueries.js";

async function postsView(req, res) {
  if (req.session.passport?.user) {
    try {
      const currentUserId = req.session.passport.user;
      const results = await postsQueries.getUserById(currentUserId);
      const username = results.username;
      res.render("posts", {
        currentUser: username ?? "unknown guest",
        noUser: false,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.render("posts", { currentUser: "unknown guest", noUser: true });
  }
}

export default {
  postsView,
};
