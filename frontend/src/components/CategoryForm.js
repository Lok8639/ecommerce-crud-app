import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [category_name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:5000/api/categories');
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/categories', { category_name, description });
      setName('');
      setDescription('');
      fetchCategories();
    } catch (err) {
      alert('Category already exists or input error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h3>Add Category</h3>
      <form onSubmit={handleSubmit}>
        <input value={category_name} onChange={e => setName(e.target.value)} placeholder="Category name" required />
        <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
        <button type="submit">Add</button>
      </form>

      <h3>Categories</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.category_id}>
              <td>{cat.category_id}</td>
              <td>{cat.category_name}</td>
              <td>{cat.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
