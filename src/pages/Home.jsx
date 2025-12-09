import Placeholder from "../assets/images.png";
import Card from "../components/Card.jsx";

export default function Home() {
  const sampleContent = [
    {
      id: 1,
      name: "Nombre del Producto",
      image: Placeholder,
      description: "Esta es una descripción del producto.",
      price: "$100,000",
    },
    {
      id: 2,
      name: "Nombre del Producto",
      image: Placeholder,
      description: "Esta es una descripción del producto.",
      price: "$100,000",
    },
    {
      id: 3,
      name: "Nombre del Producto",
      image: Placeholder,
      description: "Esta es una descripción del producto.",
      price: "$100,000",
    },
    {
      id: 4,
      name: "Nombre del Producto",
      image: Placeholder,
      description: "Esta es una descripción del producto.",
      price: "$100,000",
    },
  ];
  return (
    <div>
      <ul>
        {sampleContent.map((item) => (
          <Card key={item.id} content={item} />
        ))}
      </ul>
    </div>
  );
}
