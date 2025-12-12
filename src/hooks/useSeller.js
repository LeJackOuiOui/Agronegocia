// src/hooks/useVendedor.js
import { useState, useEffect } from "react";
import { authService } from "../services/supabase/auth";
import { database } from "../services/supabase/database";

export const useVendedor = () => {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const userProfile = await authService.getUserProfile();
      setPerfil(userProfile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const convertirseEnVendedor = async (vendedorData) => {
    try {
      if (!perfil) {
        throw new Error("Usuario no autenticado");
      }

      const result = await authService.convertToVendedor(
        perfil.cedula,
        vendedorData
      );

      // Recargar perfil
      await cargarPerfil();

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const crearProducto = async (productoData) => {
    try {
      if (!perfil?.vendedor) {
        throw new Error("Debes ser vendedor");
      }

      const producto = await database.productos.create({
        ...productoData,
        id_vendedor: perfil.vendedor.id_vendedor,
      });

      return producto;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  return {
    perfil,
    loading,
    error,
    esVendedor: !!perfil?.vendedor,
    convertirseEnVendedor,
    crearProducto,
    recargarPerfil: cargarPerfil,
  };
};
