// src/components/BecomeVendorForm.jsx
import React, { useState } from "react";
import { authService } from "../services/supabase/auth";
import { useNavigate } from "react-router-dom";

function BecomeVendorForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    descripcion: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Obtener usuario actual para sacar la cédula
      const userProfile = await authService.getUserProfile();
      if (!userProfile) {
        throw new Error("No hay usuario autenticado");
      }

      // Convertir en vendedor
      const result = await authService.convertToVendedor(
        userProfile.cedula,
        formData
      );

      alert("¡Ahora eres vendedor!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Convertirse en Vendedor</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del negocio:</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Dirección:</label>
          <input
            type="text"
            value={formData.direccion}
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Teléfono de contacto:</label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
            required
          />
        </div>

        <div>
          <label>Descripción del negocio:</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            rows={4}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse como Vendedor"}
        </button>
      </form>
    </div>
  );
}
