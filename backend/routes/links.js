const express = require("express");
const pool = require("../db");
const { requireAuth } = require("../middleware/auth");
const { generateCode } = require("../utils/shortcode");

const router = express.Router();

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

router.post("/links", async (req, res, next) => {
  const { url } = req.body;
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: "A valid url is required" });
  }

  const rawUserId = req.headers["x-user-id"];
  try {
    let userId = null;
    if (rawUserId) {
      if (!/^\d+$/.test(rawUserId)) {
        return res.status(401).json({ error: "Invalid X-User-Id header" });
      }
      const userResult = await pool.query("SELECT id FROM users WHERE id = $1", [rawUserId]);
      if (userResult.rows.length === 0) {
        return res.status(401).json({ error: "Unknown user" });
      }
      userId = Number(rawUserId);
    }

    const code = generateCode();
    const result = await pool.query(
      "INSERT INTO links (code, original_url, user_id) VALUES ($1, $2, $3) RETURNING code, original_url, created_at",
      [code, url, userId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.get("/links", requireAuth, async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT l.code, l.original_url, l.created_at, COUNT(c.id)::int AS clicks
       FROM links l
       LEFT JOIN clicks c ON c.link_id = l.id
       WHERE l.user_id = $1
       GROUP BY l.id
       ORDER BY l.created_at DESC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

router.get("/links/:code/stats", requireAuth, async (req, res, next) => {
  try {
    const linkResult = await pool.query(
      "SELECT id, code, original_url, created_at FROM links WHERE code = $1 AND user_id = $2",
      [req.params.code, req.userId]
    );
    const link = linkResult.rows[0];
    if (!link) {
      return res.status(404).json({ error: "Link not found" });
    }

    const clicksResult = await pool.query(
      "SELECT clicked_at, referrer FROM clicks WHERE link_id = $1 ORDER BY clicked_at DESC",
      [link.id]
    );

    res.json({ ...link, clicks: clicksResult.rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
