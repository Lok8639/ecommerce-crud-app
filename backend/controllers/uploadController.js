const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const db = require("../db");

const handleExcelUpload = async (req, res) => {
  try {
    const filePath = path.join(__dirname, "../", req.file.path);
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    let inserted = 0;
    let skipped = 0;

    for (let item of data) {
      // ✅ Clean and sanitize inputs
      const name = item.name?.trim();
      const category_name = item.category_name?.trim();
      const price = parseFloat(item.price);
      const stock = parseInt(item.stock);

      // ✅ Skip if any value is missing
      if (!name || !category_name || isNaN(price) || isNaN(stock)) {
        console.warn(`⚠️ Skipped invalid row:`, item);
        skipped++;
        continue;
      }

      // ✅ Check for duplicates
      const [existing] = await db.query(
        "SELECT * FROM products WHERE name = ? AND category_name = ?",
        [name, category_name]
      );
      if (existing.length > 0) {
        console.log(`⚠️ Duplicate skipped: ${name} - ${category_name}`);
        skipped++;
        continue;
      }

      // ✅ Insert into database
      await db.query(
        "INSERT INTO products (name, category_name, price, stock) VALUES (?, ?, ?, ?)",
        [name, category_name, price, stock]
      );
      console.log(`✅ Inserted: ${name} (${category_name})`);
      inserted++;
    }

    fs.unlinkSync(filePath); // Cleanup uploaded file

    res.json({
      message: "Excel uploaded successfully",
      inserted,
      skipped
    });

  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { handleExcelUpload };
