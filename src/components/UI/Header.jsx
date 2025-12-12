import Logo from "../../assets/logooo.png";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import CartModal from "./CartModal";
import { useState } from "react";
import "../../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { user, isVendedor, cartCount, logout, setCurrentForm } =
    useAppContext();
  const [showCart, setShowCart] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLoginClick = () => {
    setCurrentForm("login");
    navigate("/forms");
  };

  const handleRegisterSeller = () => {
    if (!user) {
      setCurrentForm("login");
      navigate("/forms");
      return;
    }
    setCurrentForm("seller");
    navigate("/forms");
  };

  const handleCreateProduct = () => {
    if (!user) {
      setCurrentForm("login");
      navigate("/forms");
      return;
    }
    if (!isVendedor) {
      alert("Debes ser vendedor para crear productos");
      handleRegisterSeller();
      return;
    }
    setCurrentForm("product");
    navigate("/forms");
  };

  const handleViewProducts = () => {
    navigate("/products");
  };

  const handleInicio = () => {
    navigate("/");
  };

  return (
    <header className="w-full h-24 bg-[#2b2b2b] text-[#9fd8a0] flex items-center justify-between px-12 shadow-lg fixed top-0 left-0 z-50 border-b border-[#9fd8a0]">
      <div
        className="flex items-center space-x-4 cursor-pointer"
        onClick={handleInicio}
      >
        <img
          src={Logo}
          alt="Logo"
          className="w-14 h-14 object-contain border border-[#9fd8a0] rounded"
        />

        <div className="text-3xl font-extrabold tracking-wide">
          Agro Negocio
        </div>
      </div>

      <nav className="flex items-center space-x-6 text-lg font-medium">
        {/* Botón para ver productos */}
        <button
          onClick={handleViewProducts}
          className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded bg-transparent text-[#9fd8a0] font-medium"
        >
          Ver Productos
        </button>

        {/* Botón de Login/Cuenta - Cambia según estado */}
        {!user ? (
          <button
            onClick={handleLoginClick}
            className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded bg-transparent text-[#9fd8a0] font-medium"
          >
            Iniciar Sesión / Crear Cuenta
          </button>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded bg-transparent text-[#9fd8a0] font-medium"
            >
              Hola, {user.email?.split("@")[0]}
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-[#2b2b2b] border border-[#9fd8a0] rounded shadow-lg z-50">
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 hover:bg-[#3a3a3a] text-[#9fd8a0]"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}

        {/* Botón para ser vendedor - Solo aparece si no es vendedor */}
        {user && !isVendedor && (
          <button
            onClick={handleRegisterSeller}
            className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded bg-[#9fd8a0] text-[#2b2b2b] font-bold hover:bg-[#8bc78c]"
          >
            Ser Vendedor
          </button>
        )}

        {/* Botón para crear producto - Solo aparece si es vendedor */}
        {isVendedor && (
          <button
            onClick={handleCreateProduct}
            className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded bg-[#ffc107] text-[#2b2b2b] font-bold hover:bg-[#e0a800]"
          >
            + Crear Producto
          </button>
        )}

        {/* Carrito de compras - Solo si hay usuario */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setShowCart(true)}
              className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded bg-[#6c757d] text-white font-medium flex items-center gap-2"
            >
              🛒 Carrito
              {cartCount > 0 && (
                <span className="bg-[#dc3545] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        )}
      </nav>

      {showCart && <CartModal onClose={() => setShowCart(false)} />}
    </header>
  );
}
