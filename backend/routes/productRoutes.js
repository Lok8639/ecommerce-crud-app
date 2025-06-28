const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all products
router.get("/", (req, res) => {
  const sql = `
    SELECT p.id, p.name, c.name AS category, p.price, p.stock
    FROM products p
    JOIN categories c ON p.category_id = c.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Add a product
router.post("/", (req, res) => {
  const { name, category_name, price, stock } = req.body;

  db.query("SELECT id FROM categories WHERE name = ?", [category_name], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: "Invalid category name" });
    }

    const category_id = results[0].id;

    db.query(
      "INSERT INTO products (name, category_id, price, stock) VALUES (?, ?, ?, ?)",
      [name, category_id, price, stock],
      (err2) => {
        if (err2) return res.status(500).json({ error: "Insert failed" });
        res.json({ success: true });
      }
    );
  });
});

// Delete a product
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: "Delete failed" });
    res.json({ success: true });
  });
});

module.exports = router;
