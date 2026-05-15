import bcrypt from "bcryptjs";

async function genPassword(password) {
  const genHash = await bcrypt.hash(password, 10);
  return genHash;
}

async function validPassword(password, hashed) {
  const match = await bcrypt.compare(password, hashed);
  return match;
}

export { genPassword, validPassword };
