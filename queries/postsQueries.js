import { appPool } from "../db/pool.js";

async function getUserById(user_id) {
  const { rows } = await appPool.query(
    "SELECT * FROM users WHERE user_id = $1",
    [user_id],
  );
  return rows[0];
}

export default {
  getUserById,
};
