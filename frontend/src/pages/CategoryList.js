import React, { useEffect, useState } from 'react';
import { fetchCategories } from '../services/api';

function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(data => setCategories(data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Categorias</h2>
      <ul>
        {categories.map(category => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryList;
