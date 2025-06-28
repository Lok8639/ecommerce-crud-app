const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',                 // ✅ use 'root'
  password: 'Lokesh@123',       // ✅ your actual MySQL password
  database: 'ecom'              // ✅ replace with your DB name
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database!');
});

module.exports = db;
