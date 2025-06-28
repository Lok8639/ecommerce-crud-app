const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');// <-- ADD THIS
const uploadRoute = require('./routes/uploadRoute');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes); // <-- ADD THIS
app.use('/api/upload', uploadRoute);

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
