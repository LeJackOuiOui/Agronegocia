// src/components/ListaProductos.jsx
import { useEffect, useState } from "react";
import Card from "./Card";
import { database } from "../../services/supabase/database";

export default function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      setError("");

      // Obtener productos desde Supabase
      const data = await database.productos.getAllWithDetails();
      console.log("📦 Productos cargados:", data);

      setProductos(data || []);
    } catch (err) {
      console.error("❌ Error cargando productos:", err);
      setError(
        "No se pudieron cargar los productos. Intenta de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = !productos || productos.length === 0;

  return (
    <div className="dark:bg-[#1a1a1a] bg-white dark:text-white text-black border border-[#9fd8a0] p-4 rounded-lg my-6 shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-2xl font-bold text-[#9fd8a0]">
          Productos Disponibles
        </h2>
        <button
          onClick={loadProductos}
          className="px-3 py-1 text-sm bg-[#2b2b2b] border border-[#9fd8a0] text-[#9fd8a0] rounded hover:opacity-80"
        >
          🔄 Actualizar
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9fd8a0]"></div>
          <p className="mt-2 text-gray-400">Cargando productos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded">
          <p className="font-bold">⚠️ Error</p>
          <p>{error}</p>
          <button
            onClick={loadProductos}
            className="mt-2 px-3 py-1 bg-red-700 text-white rounded text-sm"
          >
            Reintentar
          </button>
        </div>
      ) : isEmpty ? (
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">
            😔 No hay productos disponibles todavía.
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Sé el primero en publicar un producto.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
          {productos.map((producto) => (
            <div key={producto.id_producto} className="animate-fadeIn">
              <Card producto={producto} />
            </div>
          ))}
        </div>
      )}

      {!isEmpty && !loading && (
        <div className="mt-4 text-center text-gray-400 text-sm">
          Mostrando {productos.length} producto
          {productos.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}
