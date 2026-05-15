import { appPool } from "../db/pool.js";
import { genPassword } from "../utils/passwordUtils.js";

async function addNewUser(username, password_raw) {
  const passwordHashed = await genPassword(password_raw);
  const SQL = "INSERT INTO users (username, password) VALUES ($1, $2)";

  await appPool.query(SQL, [username, passwordHashed]);
}

export default {
  addNewUser,
};
