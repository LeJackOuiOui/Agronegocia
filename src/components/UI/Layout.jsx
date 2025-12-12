import { useState } from "react";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Alert from "./Alert.jsx";

export default function Layout({ children }) {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <main className="mx-auto p-4 sm:p-6 font-sans leading-relaxed text-gray-800 dark:text-gray-100 bg-white dark:bg-neutral-900 min-h-screen">
      <Header />

      {/* Mostrar alerta solo si el estado está activo */}
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)}>
          ¡Operación realizada con éxito!
        </Alert>
      )}

      <section>{children}</section>

      <Footer />
    </main>
  );
}
