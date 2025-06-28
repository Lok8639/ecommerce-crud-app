
# 🛒 E-Commerce CRUD Web App (Intern Test Project)
A full-stack admin panel to manage product categories and products with Excel upload functionality.

## 📦 Features

- ✅ Category Management: Add, view categories
- ✅ Product Management: Add, view, edit, delete products
- ✅ Excel Upload: Upload products via Excel
- ✅ Database Integration: MySQL
- ✅ Frontend: React
- ✅ Backend: Node.js with Express

---

## 🔧 How to Run

### 🖥️ Backend Setup

1. Navigate to `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure MySQL connection in `db.js`:
   ```js
   const connection = mysql.createConnection({
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'ecommerce_db'
   });
   ```

4. Start backend:
   ```bash
   node server.js
   ```

### 🌐 Frontend Setup

1. Navigate to `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start React app:
   ```bash
   npm start
   ```

---

## 🗃️ Database Setup

1. Open MySQL CLI or any MySQL client.
2. Run schema SQL:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
3. (Optional) Insert sample data:
   ```bash
   mysql -u root -p ecommerce_db < database/sample_data.sql
   ```

---

## 🧾 Excel Upload Format

**Sheet Name**: `Products`

| product_name | category_name | price | stock |
|--------------|----------------|-------|--------|
| Laptop       | Electronics    | 50000 | 10     |
| Book A       | Books          | 300   | 25     |

- Ensure the category already exists in the DB before uploading products.

---

## 📁 Folder Structure

- `backend/` – Express server, routes, DB logic
- `frontend/` – React admin panel
- `database/` – SQL scripts and sample Excel
