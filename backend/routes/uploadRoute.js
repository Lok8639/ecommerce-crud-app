const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const db = require('../db');

const router = express.Router();

// Setup Multer for file uploads (save to 'Fuploads/' folder)
const upload = multer({ dest: 'Fuploads/' });

// Route: POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    let inserted = 0;
    let skipped = 0;

    const insertPromises = data.map((item, index) => {
      return new Promise((resolve) => {
        const { name, category_id, price, stock } = item;

        if (!name || !category_id || price == null || stock == null) {
          console.warn(`⚠️ Row ${index + 2} skipped: Missing fields`, item);
          skipped++;
          return resolve();
        }

        // Check for duplicates
        db.query(
          'SELECT COUNT(*) AS count FROM products WHERE name = ? AND category_id = ?',
          [name, category_id],
          (err, results) => {
            if (err) {
              console.error(`❌ Error checking row ${index + 2}:`, err.message);
              skipped++;
              return resolve();
            }

            if (results[0].count === 0) {
              // Insert product
              db.query(
                'INSERT INTO products (name, category_id, price, stock) VALUES (?, ?, ?, ?)',
                [name, category_id, price, stock],
                (err) => {
                  if (err) {
                    console.error(`❌ Failed to insert row ${index + 2}:`, err.message);
                    skipped++;
                  } else {
                    console.log(`✅ Inserted row ${index + 2}:`, name);
                    inserted++;
                  }
                  resolve();
                }
              );
            } else {
              console.warn(`⚠️ Row ${index + 2} skipped: Duplicate product '${name}'`);
              skipped++;
              resolve();
            }
          }
        );
      });
    });

    // Wait for all inserts to finish
    Promise.all(insertPromises).then(() => {
      // Delete uploaded file
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.warn('⚠️ Failed to delete uploaded file:', err.message);
        }
      });

      res.json({
        success: true,
        message: 'Upload and insert complete',
        inserted,
        skipped,
      });
    });

  } catch (err) {
    console.error('❌ Upload error:', err.message);
    res.status(500).json({ error: 'Failed to process file' });
  }
});

module.exports = router;
