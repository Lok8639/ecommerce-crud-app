const express = require('express');
const db = require('../db');

const router = express.Router(); // ✅ Define router BEFORE using it

// GET all categories
router.get('/', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results); // Send category list
  });
});

// POST a new category
router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, id: result.insertId });
  });
});

module.exports = router;
