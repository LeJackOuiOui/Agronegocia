// src/components/CreateProductForm.jsx
import React, { useState, useEffect } from "react";
import { database } from "../services/supabase/database";
import { productImageService } from "../services/api/productImageService";
import { authService } from "../services/supabase/auth";

function CreateProductForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: null,
  });
  const [loading, setLoading] = useState(false);
  const [esVendedor, setEsVendedor] = useState(false);
  const [vendedorId, setVendedorId] = useState(null);

  useEffect(() => {
    checkVendorStatus();
  }, []);

  const checkVendorStatus = async () => {
    try {
      const profile = await authService.getUserProfile();
      if (profile?.vendedor) {
        setEsVendedor(true);
        setVendedorId(profile.vendedor.id_vendedor);
      }
    } catch (error) {
      console.error("Error checking vendor status:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!esVendedor) {
      alert("Debes ser vendedor para publicar productos");
      return;
    }

    setLoading(true);

    try {
      // 1. Crear producto
      const producto = await database.productos.create({
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        id_vendedor: vendedorId,
      });

      // 2. Subir imagen si existe
      if (formData.imagen) {
        await productImageService.uploadProductImage(
          formData.imagen,
          producto.id_producto,
          vendedorId
        );
      }

      alert("¡Producto creado exitosamente!");
      setFormData({ nombre: "", precio: "", descripcion: "", imagen: null });
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!esVendedor) {
    return (
      <div>
        <p>Debes registrarte como vendedor para publicar productos.</p>
        {/* Enlace para registrarse como vendedor */}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nombre del producto:</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Precio:</label>
        <input
          type="number"
          step="0.01"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Descripción:</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          rows={4}
          required
        />
      </div>

      <div>
        <label>Imagen del producto:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, imagen: e.target.files[0] })
          }
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creando producto..." : "Publicar Producto"}
      </button>
    </form>
  );
}
