// src/components/forms/LoginForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { authService } from "../../services/supabase/auth";
import "../../styles/LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();
  const { login, setCurrentForm } = useAppContext();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    cedula: "",
    nombre: "",
    telefono: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await authService.signIn(
        loginData.email,
        loginData.password
      );

      login(result.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validaciones
    if (registerData.password !== registerData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const result = await authService.signUp({
        cedula: registerData.cedula,
        nombre: registerData.nombre,
        telefono: registerData.telefono,
        email: registerData.email,
        password: registerData.password,
      });

      if (result.success) {
        // Auto login después de registro
        const loginResult = await authService.signIn(
          registerData.email,
          registerData.password
        );

        login(loginResult.user);
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>{isRegister ? "Crear Cuenta" : "Iniciar Sesión"}</h2>
        <button
          className="toggle-btn"
          onClick={() => setIsRegister(!isRegister)}
        >
          {isRegister
            ? "¿Ya tienes cuenta? Inicia Sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isRegister ? (
        <form onSubmit={handleRegister} className="login-form">
          <input
            type="text"
            placeholder="Cédula"
            value={registerData.cedula}
            onChange={(e) =>
              setRegisterData({ ...registerData, cedula: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Nombre completo"
            value={registerData.nombre}
            onChange={(e) =>
              setRegisterData({ ...registerData, nombre: e.target.value })
            }
            required
          />

          <input
            type="tel"
            placeholder="Teléfono"
            value={registerData.telefono}
            onChange={(e) =>
              setRegisterData({ ...registerData, telefono: e.target.value })
            }
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            value={registerData.email}
            onChange={(e) =>
              setRegisterData({ ...registerData, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={registerData.password}
            onChange={(e) =>
              setRegisterData({ ...registerData, password: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={registerData.confirmPassword}
            onChange={(e) =>
              setRegisterData({
                ...registerData,
                confirmPassword: e.target.value,
              })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Crear Cuenta"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar Sesión"}
          </button>
        </form>
      )}

      <div className="login-footer">
        <p>¿Quieres vender productos?</p>
        <button
          className="seller-btn"
          onClick={() => {
            if (!isRegister) setIsRegister(true);
            // Aquí podrías pre-rellenar el formulario de registro
          }}
        >
          Regístrate como vendedor
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
