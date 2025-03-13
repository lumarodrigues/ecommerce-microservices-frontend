import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductPage.css';

function ProductPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);

  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/api/v1/products/${productId}/`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (product.stock > 0) {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
      console.log(`Produto ${product.name} adicionado ao carrinho`);
    } else {
      alert("Este produto está fora de estoque!");
    }
  };

  const handleCheckout = async () => {
    console.log("Botão 'Finalizar Pedido' clicado");
    try {
      const orderData = {
        customer_name: "Cliente Teste",
        address: "Endereço do Cliente",
        items: cart.map(item => ({
          product_sku: item.sku,
          quantity: item.quantity,
          unit_price: item.price,
          product_name: item.name,
        })),
      };

      const response = await axios.post("http://127.0.0.1:8000/api/v1/orders/", orderData);

      if (response.data && response.data.order_id) {
        console.log(response.data);
        const order = response.data;

        navigate('/order-confirmation', { state: { order } });

        setCart([]);
        localStorage.removeItem("cart");
        alert("Pedido realizado com sucesso!");
      } else {
        alert("Erro ao realizar o pedido: resposta inesperada do servidor.");
      }
    } catch (error) {
      console.error("Erro ao realizar o pedido:", error);
      alert("Erro ao realizar o pedido: " + (error.response ? error.response.data.detail : error.message));
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro ao carregar o produto: {error}</div>;
  }

  if (!product) {
    return <div>Produto não encontrado.</div>;
  }

  return (
    <div className="product-page">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
      </div>
      <div className="product-info">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-description"><strong>Descrição:</strong> {product.description}</p>
        <p className="product-brand"><strong>Marca:</strong> {product.brand.name.charAt(0).toUpperCase() + product.brand.name.slice(1)}</p>
        <p className="product-category"><strong>Categoria:</strong> {product.category.name.charAt(0).toUpperCase() + product.category.name.slice(1)}</p>
        <p className="product-price"><strong>Preço:</strong> R${product.price}</p>
        <p className="product-stock"><strong>Estoque:</strong> {product.stock}</p>
        <p className="product-sku"><strong>Código SKU:</strong> {product.sku}</p>
        <p className="product-discount"><strong>Desconto:</strong> {product.discount_percentage}%</p>
        <h3>Atributos</h3>
        <ul className="product-attributes">
          {product.attributes.map((attr, index) => (
            <li key={index}>
              {attr.key}: {attr.value}
            </li>
          ))}
        </ul>

        <button onClick={handleAddToCart} className="add-to-cart-button">
          Adicionar ao Carrinho
        </button>
      </div>

      <div className="cart-info">
        <h2>Carrinho</h2>
        {cart.length === 0 ? (
          <p>O carrinho está vazio.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.name} - Quantidade: {item.quantity} - Preço: R${item.price}
              </li>
            ))}
          </ul>
        )}
        <button onClick={handleCheckout} className="checkout-button">
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
