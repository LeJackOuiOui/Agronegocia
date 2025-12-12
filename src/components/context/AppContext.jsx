// src/context/AppContext.js
import React, { createContext, useState, useContext } from "react";

const AppContext = createContext();

export default function AppProvider({ children }) {
  // Estados globales
  const [currentForm, setCurrentForm] = useState("login"); // 'login', 'product', 'seller'
  const [formData, setFormData] = useState({
    // Datos compartidos entre formularios
    producto: {},
    vendedor: {},
    usuario: {},
  });
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const value = {
    currentForm,
    setCurrentForm,
    formData,
    setFormData,
    user,
    setUser,
    selectedProduct,
    setSelectedProduct,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
