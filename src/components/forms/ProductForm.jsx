// src/components/forms/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { database } from "../../services/supabase/database";
import { authService } from "../../services/supabase/auth";
import { productImageService } from "../../services/API/imageService";
import "../../styles/ProductForm.css";

function ProductForm() {
  const navigate = useNavigate();
  const { user, updateUser } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  const [vendedorData, setVendedorData] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    imagen: null,
  });

  // Cargar perfil del usuario al montar el componente
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;

      try {
        console.log("🔍 Cargando perfil del usuario...");

        // Obtener perfil completo del usuario
        const profile = await authService.getUserProfile();
        console.log("📋 Perfil obtenido:", profile);

        if (profile) {
          setUserProfile(profile);

          // Si es vendedor, obtener datos específicos del vendedor
          if (profile.es_vendedor && profile.cedula) {
            console.log(
              "🔍 Buscando datos de vendedor con cédula:",
              profile.cedula
            );

            const vendedor = await database.vendedores.getByCedula(
              profile.cedula
            );
            console.log("📋 Datos de vendedor:", vendedor);

            setVendedorData(vendedor);
          }
        }
      } catch (error) {
        console.error("❌ Error cargando perfil:", error);
        setError(`Error cargando perfil: ${error.message}`);
      }
    };

    loadUserProfile();
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, imagen: file }));

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // En tu ProductForm.jsx, modifica la parte de handleSubmit:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🟡 Iniciando creación de producto...");

      // Validaciones previas...
      if (!user) throw new Error("Debes iniciar sesión");
      if (!vendedorData) throw new Error("No eres vendedor registrado");

      // 1. Crear el producto primero (sin imagen)
      const producto = await database.productos.create({
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
        id_vendedor: vendedorData.id_vendedor,
        imagen_url: null, // Inicialmente null
      });

      console.log("✅ Producto creado (ID:", producto.id_producto + ")");

      // 2. Subir imagen si existe
      if (formData.imagen) {
        console.log("🟡 Subiendo imagen...");

        const uploadResult = await productImageService.uploadProductImage(
          formData.imagen,
          producto.id_producto,
          vendedorData.id_vendedor
        );

        if (!uploadResult.success) {
          console.warn("⚠️ Imagen no se pudo subir:", uploadResult.error);
          // Mostrar advertencia pero continuar
          alert(
            `Producto creado, pero la imagen no se pudo subir: ${uploadResult.error}`
          );
        } else {
          console.log("✅ Imagen subida exitosamente:", uploadResult.url);
          // Actualizar el estado local con la nueva URL si es necesario
          producto.imagen_url = uploadResult.url;
        }
      }

      alert("¡Producto creado exitosamente!");

      // Redirigir después de un breve delay para ver feedback
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (err) {
      console.error("❌ Error detallado:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar estado de carga del perfil
  if (user && !userProfile) {
    return (
      <div className="product-form-container">
        <div className="loading-state">
          <p>Cargando tu perfil de usuario...</p>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no es vendedor
  if (userProfile && !userProfile.es_vendedor) {
    return (
      <div className="product-form-container">
        <div className="not-vendor-message">
          <h2>❌ No eres vendedor</h2>
          <p>Para crear productos, primero debes registrarte como vendedor.</p>

          <div className="action-buttons">
            <button className="cancel-btn" onClick={() => navigate("/")}>
              Volver al Inicio
            </button>

            <button
              className="become-vendor-btn"
              onClick={() => {
                // Navegar al formulario de registro de vendedor
                // Esto depende de cómo tengas implementada la navegación
                // Si usas contexto:
                // setCurrentForm('seller'); navigate('/forms');
                // O simplemente:
                alert("Ve a la página principal y haz clic en 'Ser Vendedor'");
              }}
            >
              Registrarme como Vendedor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-form-container">
      <h2>Crear Nuevo Producto</h2>

      <div className="vendor-info">
        {vendedorData && (
          <p className="vendor-name">
            Publicando como:{" "}
            <strong>{vendedorData.nombre || userProfile?.nombre}</strong>
          </p>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label>Nombre del producto *</label>
          <input
            type="text"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
            maxLength={100}
            placeholder="Ej: Manzanas Orgánicas"
          />
        </div>

        <div className="form-group">
          <label>Precio ($) *</label>
          <div className="price-input-container">
            <span className="currency-symbol">$</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.precio}
              onChange={(e) =>
                setFormData({ ...formData, precio: e.target.value })
              }
              required
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Descripción *</label>
          <textarea
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            rows={4}
            required
            maxLength={500}
            placeholder="Describe tu producto (origen, características, beneficios)..."
          />
          <div className="char-counter">
            {formData.descripcion.length}/500 caracteres
          </div>
        </div>

        <div className="form-group">
          <label>Imagen del producto</label>
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="product-image"
              disabled={loading}
            />
            <label
              htmlFor="product-image"
              className={`upload-btn ${loading ? "disabled" : ""}`}
            >
              {formData.imagen ? "Cambiar imagen" : "Seleccionar imagen"}
            </label>

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, imagen: null }));
                    setImagePreview("");
                  }}
                  disabled={loading}
                >
                  ×
                </button>
              </div>
            )}

            {formData.imagen && (
              <p className="file-name">
                📁 {formData.imagen.name} (
                {(formData.imagen.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <p className="helper-text">Formatos: JPG, PNG, GIF, WEBP. Máx 5MB</p>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading || !userProfile?.es_vendedor}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Creando producto...
              </>
            ) : (
              "Publicar Producto"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
