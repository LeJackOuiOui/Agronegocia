import ProductCard from "./ProductCard.jsx";

export default function ListaProductos({ productos = [], onSelect, children }) {
  const isEmpty = !productos || productos.length === 0;

  return (
    <section className="space-y-4">
      {children}

      {isEmpty ? (
        <p className="text-gray-400">No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {productos.map((p, index) => (
            <ProductCard key={index} product={p} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}
