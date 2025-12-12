
import { useState } from "react";
import DarkModeToggle from "./Darckmode.jsx";
import Footer from "./Footer.jsx";
import Alert from "./Alert.jsx";

export default function Layout({ children }) {
  const [showAlert, setShowAlert] = useState(false);

  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 font-sans leading-relaxed text-gray-800 dark:text-gray-100 bg-white dark:bg-neutral-900 min-h-screen">

      {/* Mostrar alerta solo si el estado está activo */}
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)}>
          ¡Operación realizada con éxito!
        </Alert>
      )}

      <section>{children}</section>

      {/* Botón para activar la alerta (ejemplo) */}
      <button
        onClick={() => setShowAlert(true)}
        className="mt-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Activar alerta
      </button>

      <DarkModeToggle />
      <Footer />
    </main>
  );
}
