// src/components/Card.jsx
import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import ProductModal from "./ProductModal";

export default function Card({ producto }) {
  const { addToCart, user } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [showModal, setShowModal] = useState(false); // Estado para modal

  // Manejar la imagen (usar imagen de Supabase o placeholder)
  const imageUrl = producto.imagen_url
    ? producto.imagen_url
    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

  // Formatear precio
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(producto.precio);

  // Formatear descripción (limitar longitud)
  const shortDescription = producto.descripcion
    ? producto.descripcion.length > 100
      ? producto.descripcion.substring(0, 100) + "..."
      : producto.descripcion
    : "Sin descripción disponible";

  // Nombre del vendedor
  const sellerName =
    producto.vendedor?.usuario?.nombre ||
    producto.vendedor?.nombre ||
    "Vendedor";

  const handleAddToCart = async () => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    setIsAdding(true);

    try {
      // Agregar al carrito
      addToCart({
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion,
        imagen_url: imageUrl,
        vendedor: producto.vendedor,
        quantity: 1,
      });

      // Feedback visual
      const button = document.activeElement;
      if (button) {
        button.classList.add("bg-green-700");
        setTimeout(() => {
          button.classList.remove("bg-green-700");
          setIsAdding(false);
        }, 500);
      }
    } catch (error) {
      console.error("Error agregando al carrito:", error);
      setIsAdding(false);
    }
  };

  const handleViewDetails = () => {
    // Aquí puedes implementar un modal o página de detalles
    alert(
      `Detalles de: ${
        producto.nombre
      }\n\nPrecio: ${formattedPrice}\nVendedor: ${sellerName}\n\n${
        producto.descripcion || "Sin descripción"
      }`
    );
  };

  return (
    <div className="bg-[#2b2b2b] text-white border border-[#9fd8a0] rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      {/* Imagen del producto */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={producto.nombre}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
          }}
        />

        {/* Etiqueta de vendedor */}
        <div className="absolute top-2 left-2 bg-[#9fd8a0]/90 text-[#2b2b2b] text-xs px-2 py-1 rounded">
          {sellerName}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3
          className="text-lg font-bold mb-2 line-clamp-1"
          title={producto.nombre}
        >
          {producto.nombre}
        </h3>

        <p
          className="text-gray-300 text-sm mb-3 line-clamp-2"
          title={producto.descripcion}
        >
          {shortDescription}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-xl font-bold text-[#9fd8a0]">
            {formattedPrice}
          </span>

          <div className="text-xs text-gray-400">
            <span className="inline-flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              {producto.id_vendedor ? "Verificado" : "Nuevo"}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-[#2b2b2b] border border-[#9fd8a0] text-[#9fd8a0] px-3 py-2 rounded text-sm font-medium hover:bg-[#9fd8a0] hover:text-[#2b2b2b] transition-colors"
          >
            Ver detalles
          </button>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || !user}
            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
              !user
                ? "bg-gray-600 cursor-not-allowed text-gray-400"
                : isAdding
                ? "bg-green-700 text-white"
                : "bg-[#9fd8a0] text-[#2b2b2b] hover:bg-[#8bc78c]"
            }`}
            title={!user ? "Inicia sesión para comprar" : ""}
          >
            {isAdding ? "Agregando..." : "🛒 Agregar"}
          </button>
        </div>
      </div>
    </div>
  );
}
