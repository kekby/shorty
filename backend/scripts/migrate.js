require("dotenv").config();
const fs = require("fs");
const path = require("path");
const pool = require("../db");

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, "..", "migrations.sql"), "utf8");
  await pool.query(sql);
  console.log("Migrations applied");
  await pool.end();
}

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});
