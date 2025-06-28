const db = require("../db");

const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    console.error("Fetch products error", err);
    res.status(500).json({ error: "Failed to get products" });
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, category_name, price, stock } = req.body;
    await db.query(
      "INSERT INTO products (name, category_name, price, stock) VALUES (?, ?, ?, ?)",
      [name, category_name, price, stock]
    );
    res.status(201).json({ message: "Product added" });
  } catch (err) {
    console.error("Add product error", err);
    res.status(500).json({ error: "Failed to add product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete product error", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

module.exports = { getProducts, addProduct, deleteProduct };
