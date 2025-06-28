// initDB.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('ecom.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_name TEXT UNIQUE NOT NULL,
      description TEXT
    )
  `, (err) => {
    if (err) {
      console.error("❌ Error creating table:", err.message);
    } else {
      console.log("✅ Table 'categories' created or already exists.");
    }

    // Close the database after setup
    db.close();
  });
});
