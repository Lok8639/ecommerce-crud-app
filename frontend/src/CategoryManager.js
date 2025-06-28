import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category_name: '', description: '' });

  const fetchCategories = async () => {
    const res = await axios.get('http://localhost:5000/api/categories');
    setCategories(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/categories', form);
    setForm({ category_name: '', description: '' });
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Category Manager</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Category Name"
          value={form.category_name}
          onChange={(e) => setForm({ ...form, category_name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map((cat) => (
          <li key={cat.category_id}>{cat.category_name} - {cat.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryManager;
