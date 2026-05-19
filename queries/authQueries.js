import { appPool } from "../db/pool.js";
import { genPassword } from "../utils/passwordUtils.js";

async function addNewUser(username, password_raw) {
  const passwordHashed = await genPassword(password_raw);
  const SQL =
    "INSERT INTO users (username, password, is_admin) VALUES ($1, $2, false)";

  await appPool.query(SQL, [username, passwordHashed]);
}

async function getUserById(user_id) {
  const { rows } = await appPool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [user_id],
  );
  return rows[0];
}

async function getUserByUsername(username) {
  const { rows } = await appPool.query(
    "SELECT * FROM users WHERE username = $1",
    [username],
  );
  return rows;
}

export default {
  addNewUser,
  getUserById,
  getUserByUsername,
};
