import { appPool } from "../db/pool.js";

async function getAllPosts() {
  const SQL = `
  SELECT post_id, username, title, content, timestamp FROM posts
  INNER JOIN users ON
  posts.user_id = users.user_id
  `;

  const { rows } = await appPool.query(SQL);
  return rows;
}

async function newPost(user_id, title, content) {
  const SQL = `
  INSERT INTO posts (user_id, title, content) VALUES ($1, $2, $3) 
  `;

  await appPool.query(SQL, [user_id, title, content]);
}

async function deletePostById(post_id) {
  await appPool.query("DELETE FROM posts WHERE post_id = $1", [post_id]);
}

export default {
  getAllPosts,
  newPost,
  deletePostById,
};
