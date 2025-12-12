import Card from "../components/Card";
import Form from "../components/Form";
import ListaProductos from "../components/ListaProductos";

export default function Home() {
  const productos = [
    {
      name: "Tomates Chonto",
      description: "Tomates frescos ideales para ensaladas y salsas.",
      price: "$8.000",
      image: "/assets/tomatee.png",
    },
    {
      name: "Cebolla Cabezona",
      description: "Cebollas orgánicas perfectas para tus comidas.",
      price: "$5.500",
      image: "/assets/cebollaa.jpg",
    },
    {
      name: "Zanahorias Premium",
      description: "Zanahorias dulces y crujientes.",
      price: "$6.000",
      image: "/assets/zanahoriaa.jpg",
    },
    {
      name: "Manzanas Rojas",
      description: "Manzanas jugosas y frescas.",
      price: "$12.000",
      image: "/assets/mazanaa.jpg",
    }
  ];

  return (
    <div className="flex justify-center">
      <div className="shadow-xl rounded-xl p-8 w-[90%] max-w-[1200px]">

        {/* Formulario */}
        <Form />

        {/* Lista de productos */}
        <ListaProductos productos={productos} />

        {/* Cards de productos */}
        <div className="grid grid-cols-4 gap-4 p-6">
          {productos.map((p, i) => (
            <Card key={i} content={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
