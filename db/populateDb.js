import { Client } from "pg";
import { connectionString } from "./pool.js";

const SQL = `
  CREATE TABLE users(
    user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    is_admin BOOLEAN
  );

  CREATE TABLE posts(
    post_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user FOREIGN KEY (user_id)
      REFERENCES users(user_id)
      ON DELETE CASCADE
  );

  CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
  )
  WITH (OIDS=FALSE);

  ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

  CREATE INDEX "IDX_session_expire" ON "session" ("expire");
`;

async function main() {
  const client = new Client({
    connectionString: connectionString,
  });
  console.log("Seeding...");
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Done!");
}

main();
