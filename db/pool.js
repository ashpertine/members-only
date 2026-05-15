import { Pool } from "pg";

const { DB_NAME, DB_USER, DB_PASS, DB_PORT, DB_HOST } = process.env;
const connectionString = `postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const appPool = new Pool({
  connectionString: connectionString,
});

export { connectionString, appPool };
