import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8001/api/v1/',
});

export const fetchProducts = async () => {
  try {
    const response = await api.get('products/');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get('categories/');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    throw error;
  }
};
