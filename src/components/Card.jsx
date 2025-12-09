export default function Card({ content }) {
  return (
    <div className="card mb-4 border p4 rounded shadow">
      <img src={content.image} alt={content.name} className="rounded" />
      <h3>{content.name}</h3>
      <p>{content.description}</p>
      <span>Precio: {content.price} </span>
      <button className="bg-green-800 text-white px-4 py-3 rounded">
        Ver más
      </button>
    </div>
  );
}
