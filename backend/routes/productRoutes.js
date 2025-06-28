const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });


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
// Upload products from Excel
router.post("/upload-excel", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const workbook = xlsx.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  const insertProduct = (product, callback) => {
    const { name, category_name, price, stock } = product;

    if (!name || !category_name || !price || !stock) {
      return callback(); // skip invalid row
    }

    // Step 1: Find or Insert category
    db.query("SELECT id FROM categories WHERE name = ?", [category_name], (err, results) => {
      if (err) return callback(err);

      if (results.length > 0) {
        const category_id = results[0].id;
        insertIntoProducts(name, category_id, price, stock, callback);
      } else {
        // Insert new category
        db.query("INSERT INTO categories (name) VALUES (?)", [category_name], (err2, result2) => {
          if (err2) return callback(err2);
          const category_id = result2.insertId;
          insertIntoProducts(name, category_id, price, stock, callback);
        });
      }
    });
  };

  const insertIntoProducts = (name, category_id, price, stock, callback) => {
    db.query(
      "INSERT INTO products (name, category_id, price, stock) VALUES (?, ?, ?, ?)",
      [name, category_id, price, stock],
      (err3) => callback(err3)
    );
  };

  let errorOccurred = false;
  let processed = 0;

  data.forEach((product) => {
    insertProduct(product, (err) => {
      if (err) {
        errorOccurred = true;
        console.error("Insert failed for row:", product, err);
      }

      processed++;
      if (processed === data.length) {
        fs.unlinkSync(req.file.path); // Clean temp file
        if (errorOccurred) {
          return res.status(500).json({ message: "Some rows failed to insert" });
        }
        return res.json({ message: "✅ Upload successful" });
      }
    });
  });
});


module.exports = router;
