// src/components/forms/SellerForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { authService } from "../../services/supabase/auth";
import "../../styles/SellerForm.css";

function SellerForm() {
  const navigate = useNavigate();
  const { user, updateUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
    descripcion: "",
    // Podrías agregar más campos específicos para vendedores
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!user) {
        throw new Error("Debes iniciar sesión primero");
      }

      // Obtener cédula del usuario
      const cedula = user.user_metadata?.cedula;

      if (!cedula) {
        throw new Error("No se encontró la cédula del usuario");
      }

      // Convertir en vendedor
      const result = await authService.convertToVendedor(cedula, formData);

      // Actualizar estado global
      await updateUser();

      alert("¡Ahora eres vendedor! Ya puedes crear productos.");
      navigate("/");
    } catch (err) {
      setError(err.message);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seller-form-container">
      <h2>Registrarse como Vendedor</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="seller-form">
        <div className="form-group">
          <label>Nombre del negocio *</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
            placeholder="Ej: Mi Tienda Online"
          />
        </div>

        <div className="form-group">
          <label>Dirección *</label>
          <input
            type="text"
            value={formData.direccion}
            onChange={(e) =>
              setFormData({ ...formData, direccion: e.target.value })
            }
            required
            placeholder="Dirección completa"
          />
        </div>

        <div className="form-group">
          <label>Teléfono de contacto *</label>
          <input
            type="tel"
            value={formData.telefono}
            onChange={(e) =>
              setFormData({ ...formData, telefono: e.target.value })
            }
            required
            placeholder="Ej: 3001234567"
          />
        </div>

        <div className="form-group">
          <label>Descripción del negocio</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            rows={4}
            placeholder="Cuéntanos sobre tu negocio..."
            maxLength={500}
          />
        </div>

        <div className="benefits">
          <h4>Beneficios de ser vendedor:</h4>
          <ul>
            <li>✅ Puedes crear y vender productos</li>
            <li>✅ Apareces en la lista de vendedores</li>
            <li>✅ Acceso a estadísticas de ventas</li>
            <li>✅ Soporte prioritario</li>
          </ul>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registrando..." : "Registrarme como Vendedor"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SellerForm;
