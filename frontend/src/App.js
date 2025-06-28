import axios from "axios";
import { useState, useEffect } from "react";

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  const handleAddCategory = async () => {
    if (!categoryName) return;
    try {
      await axios.post('/api/categories', {
        name: categoryName,
        description: description
      });
      setCategoryName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      console.error("Add category error", err);
    }
  };

  const handleAddProduct = async () => {
    if (!productName || !price || !stock || !categoryInput) return;
    try {
      await axios.post('/api/products', {
        name: productName,
        category_name: categoryInput,
        price: parseFloat(price),
        stock: parseInt(stock)
      });
      setProductName('');
      setPrice('');
      setStock('');
      setCategoryInput('');
      fetchProducts();
    } catch (err) {
      console.error("Add product error", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete product error", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadStatus('');
    setUploadError('');

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("/api/upload", formData);
      setUploadStatus('✅ Upload successful');
      fetchProducts(); // Refresh list
    } catch (err) {
      console.error("Upload error", err);
      setUploadError('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>E-Commerce Admin Panel</h1>

      <h2>Category Manager</h2>
      <input placeholder="Category Name" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
      <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <button onClick={handleAddCategory}>Add Category</button>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id}>{cat.name} - {cat.description}</li>
        ))}
      </ul>

      <hr />

      <h2>Add Product</h2>
      <input placeholder="Product name" value={productName} onChange={e => setProductName(e.target.value)} />
      <input placeholder="Category name" value={categoryInput} onChange={e => setCategoryInput(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <input placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} />
      <button onClick={handleAddProduct}>Add</button>

      <h2>Products</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.name}</td>
              <td>{prod.category}</td>
              <td>{prod.price}</td>
              <td>{prod.stock}</td>
              <td><button onClick={() => handleDeleteProduct(prod.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>📦 Upload Products (Excel File)</h2>
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {/* Status Messages */}
      {uploadStatus && <p style={{ color: 'green' }}>{uploadStatus}</p>}
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
    </div>
  );
}

export default App;
