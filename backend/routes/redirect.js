const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/:code", async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT id, original_url FROM links WHERE code = $1",
      [req.params.code]
    );
    const link = result.rows[0];
    if (!link) {
      return res.status(404).json({ error: "Short link not found" });
    }

    await pool.query("INSERT INTO clicks (link_id, referrer) VALUES ($1, $2)", [
      link.id,
      req.headers.referer || null,
    ]);

    res.redirect(302, link.original_url);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
