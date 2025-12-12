export default function Card({ content }) {
  return (
    <div className="bg-white text-gray-800 border border-green-600 rounded-xl shadow p-4">
      <img
        src={content.image}
        alt={content.name}
        className="rounded-md w-full h-32 object-cover"
      />
      <h3 className="text-lg font-bold mt-3">{content.name}</h3>
      <p className="text-sm text-gray-600">{content.description}</p>
      <p className="font-bold text-green-600 mt-2">{content.price}</p>
      <br />
      <button className="bg-green-800 text-white px-4 py-3 rounded">
        Ver más
      </button>
    </div>
  );
}
