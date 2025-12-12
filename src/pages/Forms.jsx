// src/pages/Forms.jsx
import React from "react";
import { useAppContext } from "../components/context/AppContext";
import LoginForm from "../components/forms/LoginForm";
import ProductForm from "../components/forms/ProductForm";
import SellerForm from "../components/forms/SellerForm";
import Layout from "../components/UI/Layout";

function Forms() {
  const { currentForm, formData, setFormData } = useAppContext();

  const renderForm = () => {
    switch (currentForm) {
      case "product":
        return <ProductForm data={formData.producto} />;
      case "seller":
        return <SellerForm data={formData.vendedor} />;
      case "login":
      default:
        return <LoginForm data={formData.usuario} />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-[#1a1a1a]">
        <div className="pt-24 px-4 max-w-4xl mx-auto">
          {/* Contenedor del formulario */}
          <div className="bg-[#2b2b2b] border border-[#9fd8a0] rounded-lg p-6 shadow-lg">
            {renderForm()}
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-center text-gray-400">
            <p className="mb-4">
              ¿Necesitas ayuda?{" "}
              <a href="#" className="text-[#9fd8a0] hover:underline">
                Contáctanos
              </a>
            </p>

            {currentForm === "login" && (
              <div className="bg-[#2b2b2b] border border-[#9fd8a0] rounded p-4">
                <h3 className="text-[#9fd8a0] font-bold mb-2">
                  Beneficios de registrarse:
                </h3>
                <ul className="text-left inline-block">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Acceso a todos los
                    productos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Carrito de compras
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Opción de
                    convertirte en vendedor
                  </li>
                </ul>
              </div>
            )}

            {currentForm === "seller" && (
              <div className="bg-[#2b2b2b] border border-[#9fd8a0] rounded p-4">
                <h3 className="text-[#9fd8a0] font-bold mb-2">
                  Requisitos para vendedores:
                </h3>
                <ul className="text-left inline-block">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">ⓘ</span> Debes tener una
                    cuenta de usuario
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">ⓘ</span> Información de
                    contacto verificada
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-500">ⓘ</span> Aceptar términos
                    y condiciones
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Forms;
