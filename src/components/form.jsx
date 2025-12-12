export default function Form() {
  return (
    <form className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-3">Agregar Producto</h2>

      <input
        type="text"
        placeholder="Nombre del producto"
        className="w-full mb-2 p-2 border rounded"
      />

      <input
        type="text"
        placeholder="Precio"
        className="w-full mb-2 p-2 border rounded"
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Guardar
      </button>
    </form>
  );
}
