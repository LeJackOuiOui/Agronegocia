export default function ListaProductos({ productos }) {
  return (
    <div className="bg-white p-4 rounded-lg my-6 shadow">
      <h2 className="text-xl font-bold mb-3">Lista de Productos</h2>

      <ul className="list-disc ml-6">
        {productos.map((p, index) => (
          <li key={index}>
            {p.name} — {p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}
