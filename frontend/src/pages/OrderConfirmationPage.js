import React from 'react';
import { useLocation } from 'react-router-dom';

function OrderConfirmationPage() {
  const location = useLocation();
  const { order } = location.state || {};  // Captura os dados do pedido da navegação

  if (!order) {
    return <div>Erro: Nenhum pedido encontrado.</div>;
  }

  // Calcular o total do pedido
  const total = order.items.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

  return (
    <div className="order-confirmation">
      <h1>Pedido Confirmado!</h1>
      <p><strong>Nome do Cliente:</strong> {order.customer_name}</p>
      <p><strong>Endereço:</strong> {order.address}</p>
      <h2>Itens do Pedido:</h2>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.product_name} - Quantidade: {item.quantity} - Preço: R${item.unit_price}
          </li>
        ))}
      </ul>
      <p><strong>Total:</strong> R${total}</p>
    </div>
  );
}

export default OrderConfirmationPage;
