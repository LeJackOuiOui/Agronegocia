// src/components/ProductModal.jsx
import { useEffect } from "react";

const ProductModal = ({ producto, isOpen, onClose }) => {
  // Cerrar modal con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevenir scroll
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto"; // Restaurar scroll
    };
  }, [isOpen, onClose]);

  if (!isOpen || !producto) return null;

  // Formatear precio
  const formattedPrice = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(producto.precio);

  // Nombre del vendedor
  const sellerName =
    producto.vendedor?.usuario?.nombre ||
    producto.vendedor?.nombre ||
    "Vendedor";

  // Contacto del vendedor
  const sellerContact =
    producto.vendedor?.usuario?.telefono ||
    producto.vendedor?.telefono ||
    "No disponible";

  // Imagen del producto
  const imageUrl = producto.imagen_url
    ? producto.imagen_url
    : "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div
          className="bg-white dark:bg-[#2b2b2b] rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-[#9fd8a0] animate-scaleIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-[#9fd8a0]/30 dark:border-[#9fd8a0]/30 p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#2b2b2b] dark:text-[#9fd8a0]">
              Detalles del Producto
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl p-1"
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>

          {/* Contenido con scroll */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Imagen */}
            <div className="relative h-64 md:h-80">
              <img
                src={imageUrl}
                alt={producto.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>

            {/* Información */}
            <div className="p-6 space-y-6">
              {/* Nombre y precio */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {producto.nombre}
                </h3>
                <div className="text-3xl font-bold text-[#9fd8a0]">
                  {formattedPrice}
                </div>
              </div>

              {/* Descripción */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Descripción
                </h4>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {producto.descripcion || "Sin descripción disponible"}
                </p>
              </div>

              {/* Información del vendedor */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Información del Vendedor
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Nombre
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {sellerName}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Contacto
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {sellerContact}
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalles adicionales */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  Detalles Adicionales
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-[#9fd8a0]/10 dark:bg-[#9fd8a0]/20 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ID Producto
                    </div>
                    <div className="font-mono text-gray-900 dark:text-white">
                      #{producto.id_producto}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-[#9fd8a0]/10 dark:bg-[#9fd8a0]/20 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Vendedor ID
                    </div>
                    <div className="font-mono text-gray-900 dark:text-white">
                      #{producto.id_vendedor}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-[#9fd8a0]/10 dark:bg-[#9fd8a0]/20 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Estado
                    </div>
                    <div className="font-medium text-[#9fd8a0]">
                      {producto.activo === false
                        ? "No disponible"
                        : "Disponible"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  // Aquí podrías agregar lógica para comprar directo
                  alert(`Redirigiendo a compra de: ${producto.nombre}`);
                  onClose();
                }}
                className="flex-1 px-4 py-3 bg-[#9fd8a0] text-[#2b2b2b] rounded-lg font-medium hover:bg-[#8bc78c] transition-colors"
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
};

export default ProductModal;
