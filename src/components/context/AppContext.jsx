// src/context/AppContext.jsx (cambia la extensión)
import React, { createContext, useState, useContext, useEffect } from "react";
import { supabase } from "../../services/supabase/Client";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentForm, setCurrentForm] = useState("login");
  const [formData, setFormData] = useState({
    producto: {},
    vendedor: {},
    usuario: {},
  });
  const [user, setUser] = useState(null);
  const [isVendedor, setIsVendedor] = useState(false);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    loadCartFromStorage();
  }, []);

  const loadUser = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);

        const { data: vendedor } = await supabase
          .from("Vendedores")
          .select("id_vendedor")
          .eq("cedula", session.user.user_metadata?.cedula)
          .single();

        setIsVendedor(!!vendedor);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (cartItems) => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  };

  const addToCart = (product) => {
    const existingItem = cart.find(
      (item) => item.id_producto === product.id_producto
    );

    let newCart;
    if (existingItem) {
      newCart = cart.map((item) =>
        item.id_producto === product.id_producto
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }

    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const removeFromCart = (productId) => {
    const newCart = cart.filter((item) => item.id_producto !== productId);
    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map((item) =>
      item.id_producto === productId ? { ...item, quantity } : item
    );

    setCart(newCart);
    saveCartToStorage(newCart);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.precio * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    currentForm,
    setCurrentForm,
    formData,
    setFormData,
    user,
    setUser,
    isVendedor,
    setIsVendedor,
    cart,
    cartCount,
    cartTotal,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    // En AppContext.jsx
    updateUser: async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);

          // Obtener datos actualizados de Usuarios
          const { data: usuarioData } = await supabase
            .from("Usuarios")
            .select("*")
            .eq("auth_id", session.user.id)
            .single();

          if (usuarioData) {
            // Verificar si es vendedor
            if (usuarioData.es_vendedor) {
              const { data: vendedor } = await supabase
                .from("Vendedores")
                .select("id_vendedor")
                .eq("cedula", usuarioData.cedula)
                .single();

              setIsVendedor(!!vendedor);
            } else {
              setIsVendedor(false);
            }
          }
        } else {
          setUser(null);
          setIsVendedor(false);
        }
      } catch (error) {
        console.error("Error actualizando usuario:", error);
      }
    },
    login: async (userData) => {
      setUser(userData);
      await loadUser();
    },
    logout: async () => {
      await supabase.auth.signOut();
      setUser(null);
      setIsVendedor(false);
      clearCart();
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe usarse dentro de AppProvider");
  }
  return context;
};
