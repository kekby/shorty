const pool = require("../db");

async function requireAuth(req, res, next) {
  const userId = req.headers["x-user-id"];
  if (!userId || !/^\d+$/.test(userId)) {
    return res.status(401).json({ error: "Missing or invalid X-User-Id header" });
  }

  try {
    const result = await pool.query("SELECT id FROM users WHERE id = $1", [userId]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Unknown user" });
    }
    req.userId = Number(userId);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { requireAuth };
