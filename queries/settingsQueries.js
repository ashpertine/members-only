import { appPool } from "../db/pool.js";

async function saveUserConfig(user_id, is_member, is_admin) {
  const SQL = `UPDATE users SET is_member = $2, is_admin = $3 WHERE user_id = $1`;
  await appPool.query(SQL, [user_id, is_member, is_admin]);
}

async function isUserAdmin(user_id) {
  const SQL = "SELECT is_admin FROM users WHERE user_id = $1";
  const { rows } = await appPool.query(SQL, [user_id]);

  return rows[0].is_admin;
}

export default {
  saveUserConfig,
  isUserAdmin,
};
