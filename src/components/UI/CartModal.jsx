// src/components/CartModal.jsx
import React from "react";
import { useAppContext } from "../context/AppContext";
// import "./CartModal.css";

function CartModal({ onClose }) {
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } =
    useAppContext();

  const handleCheckout = async () => {
    // Aquí implementarías la lógica de pago
    alert("Gracias por su compra! ✅");
    clearCart();
    onClose();
  };

  if (cart.length === 0) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h2>Carrito de Compras</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
          <div className="empty-cart">
            <p>Tu carrito está vacío</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Carrito de Compras</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id_producto} className="cart-item">
              <div className="item-info">
                <h4>{item.nombre}</h4>
                <p>${item.precio.toFixed(2)}</p>
                <p>Vendedor: {item.vendedor?.nombre || "N/A"}</p>
              </div>

              <div className="item-controls">
                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      updateQuantity(item.id_producto, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.id_producto, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id_producto)}
                >
                  Eliminar
                </button>
              </div>

              <div className="item-total">
                ${(item.precio * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="total-section">
            <h3>Total: ${cartTotal.toFixed(2)}</h3>
          </div>

          <div className="cart-actions">
            <button className="clear-btn" onClick={clearCart}>
              Vaciar Carrito
            </button>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartModal;
