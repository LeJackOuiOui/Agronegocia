import Card from "./Card";

export default function ListaProductos({ productos = [] }) {
  const isEmpty = !productos || productos.length === 0;
  return (
    <div className="dark:bg-black bg-white dark:text-white text-black border border-green-600 p-4 rounded-lg my-6 shadow">
      <h2 className="text-xl font-bold mb-3">Productos Disponibles</h2>

      {isEmpty ? (
        <p className="text-gray-400">No hay productos disponibles.</p>
      ) : (
        <div className="grid grid-cols-4 gap-4 p-6">
          {productos.map((p, i) => (
            <div>
              <Card key={i} content={p} />
              <br />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
