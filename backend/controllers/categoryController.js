const db = require('../db');

exports.createCategory = (req, res) => {
  const { category_name, description } = req.body;

  if (!category_name) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  db.run(
    `INSERT INTO categories (category_name, description) VALUES (?, ?)`,
    [category_name, description],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Category already exists or DB error' });
      }
      res.status(201).json({ message: 'Category added', id: this.lastID });
    }
  );
};

exports.getAllCategories = (req, res) => {
  db.all(`SELECT * FROM categories`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
    res.json(rows);
  });
};
