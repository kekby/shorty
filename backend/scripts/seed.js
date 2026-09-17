require("dotenv").config();
const bcrypt = require("bcryptjs");
const pool = require("../db");

async function seed() {
  const [email, password] = process.argv.slice(2);
  if (!email || !password) {
    console.error("Usage: node scripts/seed.js <email> <password>");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
     RETURNING id, email`,
    [email, passwordHash]
  );

  console.log("Seeded user:", result.rows[0]);
  await pool.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
