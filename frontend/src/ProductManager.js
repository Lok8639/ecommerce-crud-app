// src/ProductManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [product_name, setProductName] = useState('');
  const [category_name, setCategoryName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  const addProduct = async () => {
    if (!product_name || !category_name || price === '' || stock === '') {
      alert('Please fill all fields');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/products', {
        product_name,
        category_name,
        price: parseFloat(price),
        stock: parseInt(stock),
      });
      setProductName('');
      setCategoryName('');
      setPrice('');
      setStock('');
      fetchProducts();
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const deleteProduct = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <h2>Add Product</h2>
      <input
        type="text"
        placeholder="Product name"
        value={product_name}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category name"
        value={category_name}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      />
      <button onClick={addProduct}>Add</button>

      <h2>Products</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.product_id}>
              <td>{p.product_id}</td>
              <td>{p.product_name}</td>
              <td>{p.category_name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td><button onClick={() => deleteProduct(p.product_id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManager;
