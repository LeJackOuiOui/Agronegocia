import Card from "./components/Card";

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
    },
    {
      name: "Banano Bocadillo",
      description: "Bananos maduros listos para consumir.",
      price: "$4.500",
      image: "/assets/bananaa.jpg",
    },
    {
      name: "Papas Pastusas",
      description: "Papas ideales para purés y sopas.",
      price: "$7.000",
      image: "/assets/papass.jpg",
    },
    {
      name: "Aguacate Hass",
      description: "Aguacates suaves y cremosos.",
      price: "$9.000",
      image: "/assets/Aguacatee.jpg",
    },
    {
      name: "Limones Tahití",
      description: "Limones jugosos perfectos para bebidas.",
      price: "$3.500",
      image: "/assets/limon.jpg",
    },
    {
      name: "Lechuga Crespa",
      description: "Lechuga fresca y crocante.",
      price: "$4.000",
      image: "/assets/lechuga.jpg",
    },
    {
      name: "Fresas Dulces",
      description: "Fresas frescas ideales para postres.",
      price: "$10.500",
      image: "/assets/fresaa.jpg",
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[90%] max-w-[1200px]">
        <div className="grid grid-cols-4 gap-4 p-6">
          {productos.map((p, i) => (
            <Card key={i} content={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
