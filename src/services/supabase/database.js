// src/services/supabase/database.js
import { supabase } from "./Client";

export const database = {
  // ===== USUARIOS =====
  usuarios: {
    create: async (userData) => {
      const { data, error } = await supabase
        .from("Usuarios")
        .insert([userData])
        .select();

      if (error) throw error;
      return data[0];
    },

    getByCedula: async (cedula) => {
      const { data, error } = await supabase
        .from("Usuarios")
        .select("*")
        .eq("cedula", cedula)
        .single();

      if (error) throw error;
      return data;
    },

    getByAuthId: async (authId) => {
      const { data, error } = await supabase
        .from("Usuarios")
        .select("*")
        .eq("auth_id", authId)
        .single();

      if (error) throw error;
      return data;
    },

    update: async (cedula, updates) => {
      const { data, error } = await supabase
        .from("Usuarios")
        .update(updates)
        .eq("cedula", cedula)
        .select();

      if (error) throw error;
      return data[0];
    },

    // Verificar si existe usuario por cédula
    exists: async (cedula) => {
      const { data, error } = await supabase
        .from("Usuarios")
        .select("cedula")
        .eq("cedula", cedula)
        .single();

      return !error && data !== null;
    },
  },

  // ===== VENDEDORES ===== (cedula es FK de Usuarios)
  vendedores: {
    // Crear vendedor - cédula debe existir en Usuarios
    create: async (vendedorData) => {
      try {
        // Verificar que la cédula exista en Usuarios
        const usuarioExiste = await database.usuarios.exists(
          vendedorData.cedula
        );
        if (!usuarioExiste) {
          throw new Error("La cédula no está registrada como usuario");
        }

        // Verificar que no sea ya vendedor
        const { data: existingVendedor } = await supabase
          .from("Vendedores")
          .select("cedula")
          .eq("cedula", vendedorData.cedula)
          .single();

        if (existingVendedor) {
          throw new Error("El usuario ya es vendedor");
        }

        const { data, error } = await supabase
          .from("Vendedores")
          .insert([vendedorData])
          .select();

        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error("Error al crear vendedor:", error);
        throw error;
      }
    },

    // Obtener vendedor por cédula (FK)
    getByCedula: async (cedula) => {
      const { data, error } = await supabase
        .from("Vendedores")
        .select(
          `
          *,
          usuario:Usuarios (*)
        `
        )
        .eq("cedula", cedula)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },

    // Obtener vendedor por ID autoincremental
    getById: async (id_vendedor) => {
      const { data, error } = await supabase
        .from("Vendedores")
        .select(
          `
          *,
          usuario:Usuarios (*),
          productos:Productos (*)
        `
        )
        .eq("id_vendedor", id_vendedor)
        .single();

      if (error) throw error;
      return data;
    },

    // Obtener todos los vendedores con info de usuario
    getAll: async () => {
      const { data, error } = await supabase
        .from("Vendedores")
        .select(
          `
          *,
          usuario:Usuarios (nombre, telefono, correo)
        `
        )
        .order("nombre");

      if (error) throw error;
      return data;
    },

    // Actualizar vendedor
    update: async (cedula, updates) => {
      const { data, error } = await supabase
        .from("Vendedores")
        .update(updates)
        .eq("cedula", cedula)
        .select();

      if (error) throw error;
      return data[0];
    },

    // Eliminar vendedor (solo elimina de Vendedores, no de Usuarios)
    delete: async (cedula) => {
      const { error } = await supabase
        .from("Vendedores")
        .delete()
        .eq("cedula", cedula);

      if (error) throw error;

      // Actualizar Usuario para quitar flag de vendedor
      await database.usuarios.update(cedula, { es_vendedor: false });

      return { success: true };
    },

    // Buscar vendedores por nombre o dirección
    search: async (searchTerm) => {
      const { data, error } = await supabase
        .from("Vendedores")
        .select(
          `
          *,
          usuario:Usuarios (*)
        `
        )
        .or(`nombre.ilike.%${searchTerm}%,direccion.ilike.%${searchTerm}%`)
        .order("nombre");

      if (error) throw error;
      return data;
    },
  },

  // ===== PRODUCTOS =====
  productos: {
    // Crear producto - verifica que id_vendedor exista
    create: async (productoData) => {
      try {
        // Verificar que el vendedor existe
        const { data: vendedor } = await supabase
          .from("Vendedores")
          .select("id_vendedor")
          .eq("id_vendedor", productoData.id_vendedor)
          .single();

        if (!vendedor) {
          throw new Error("El vendedor no existe");
        }

        const { data, error } = await supabase
          .from("Productos")
          .insert([productoData])
          .select();

        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error("Error al crear producto:", error);
        throw error;
      }
    },

    // Obtener producto con vendedor y usuario
    getByIdWithDetails: async (id_producto) => {
      const { data, error } = await supabase
        .from("Productos")
        .select(
          `
          *,
          vendedor:Vendedores (
            *,
            usuario:Usuarios (*)
          )
        `
        )
        .eq("id_producto", id_producto)
        .single();

      if (error) throw error;
      return data;
    },

    // Obtener todos los productos con detalles completos
    getAllWithDetails: async (filters = {}) => {
      let query = supabase
        .from("Productos")
        .select(
          `
          *,
          vendedor:Vendedores (
            *,
            usuario:Usuarios (nombre, telefono, correo)
          )
        `
        )
        .order("id_producto", { ascending: false });

      // Aplicar filtros
      if (filters.id_vendedor) {
        query = query.eq("id_vendedor", filters.id_vendedor);
      }

      if (filters.minPrice || filters.maxPrice) {
        if (filters.minPrice) {
          query = query.gte("precio", filters.minPrice);
        }
        if (filters.maxPrice) {
          query = query.lte("precio", filters.maxPrice);
        }
      }

      if (filters.searchTerm) {
        query = query.or(
          `nombre.ilike.%${filters.searchTerm}%,` +
            `descripcion.ilike.%${filters.searchTerm}%`
        );
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },

    // Obtener productos de un vendedor específico
    getByVendedorCedula: async (cedula) => {
      // Primero obtener el id_vendedor desde la cédula
      const { data: vendedor, error: vendedorError } = await supabase
        .from("Vendedores")
        .select("id_vendedor")
        .eq("cedula", cedula)
        .single();

      if (vendedorError) throw vendedorError;

      // Luego obtener los productos
      const { data: productos, error: productosError } = await supabase
        .from("Productos")
        .select("*")
        .eq("id_vendedor", vendedor.id_vendedor)
        .order("id_producto", { ascending: false });

      if (productosError) throw productosError;
      return productos;
    },

    // Resto de funciones permanecen similares con ajustes
    update: async (id_producto, updates) => {
      const { data, error } = await supabase
        .from("Productos")
        .update(updates)
        .eq("id_producto", id_producto)
        .select();

      if (error) throw error;
      return data[0];
    },

    delete: async (id_producto) => {
      const { error } = await supabase
        .from("Productos")
        .delete()
        .eq("id_producto", id_producto);

      if (error) throw error;
    },
  },

  // ===== RELACIONES COMPLEJAS =====
  relaciones: {
    // Obtener perfil completo: Usuario + Vendedor + Productos
    getPerfilCompleto: async (cedula) => {
      try {
        // Obtener usuario
        const usuario = await database.usuarios.getByCedula(cedula);
        if (!usuario) return null;

        let vendedor = null;
        let productos = [];

        // Si es vendedor, obtener datos
        if (usuario.es_vendedor) {
          vendedor = await database.vendedores.getByCedula(cedula);
          if (vendedor) {
            productos = await database.productos.getAllWithDetails({
              id_vendedor: vendedor.id_vendedor,
            });
          }
        }

        return {
          usuario,
          vendedor,
          productos,
        };
      } catch (error) {
        console.error("Error obteniendo perfil completo:", error);
        throw error;
      }
    },

    // Verificar permisos: si usuario puede modificar producto
    canEditProduct: async (cedula, id_producto) => {
      try {
        // Obtener producto con vendedor
        const producto = await database.productos.getByIdWithDetails(
          id_producto
        );
        if (!producto) return false;

        // Obtener vendedor del producto
        const vendedorCedula = producto.vendedor.cedula;

        // Comparar con la cédula del usuario autenticado
        return cedula === vendedorCedula;
      } catch (error) {
        console.error("Error verificando permisos:", error);
        return false;
      }
    },
  },
};
