// src/services/supabase/database.js
import { supabase } from "./Client";

export const database = {
  // ===== USUARIOS =====
  usuarios: {
    create: async (userData) => {
      const { data, error } = await supabase
        .from("Usuario")
        .insert([userData])
        .select();

      if (error) throw error;
      return data[0];
    },

    getByCedula: async (cedula) => {
      const { data, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("cedula", cedula)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no encontrado
      return data;
    },

    getByAuthId: async (authId) => {
      const { data, error } = await supabase
        .from("Usuario")
        .select("*")
        .eq("auth_id", authId)
        .single();

      if (error) throw error;
      return data;
    },

    update: async (cedula, updates) => {
      const { data, error } = await supabase
        .from("Usuario")
        .update(updates)
        .eq("cedula", cedula)
        .select();

      if (error) throw error;
      return data[0];
    },

    exists: async (cedula) => {
      const { data, error } = await supabase
        .from("Usuario")
        .select("cedula")
        .eq("cedula", cedula)
        .single();

      // Si hay error y no es "no encontrado", lanzar error
      if (error && error.code !== "PGRST116") throw error;
      return !!data;
    },
  },

  // ===== VENDEDORES =====
  vendedores: {
    create: async (vendedorData) => {
      try {
        // Verificar que la cédula exista
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

    getByCedula: async (cedula) => {
      const { data, error } = await supabase
        .from("Vendedores")
        .select(
          `
          *,
          usuario:Usuario!inner(*)
        `
        )
        .eq("cedula", cedula)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },

    getById: async (id_vendedor) => {
      const { data, error } = await supabase
        .from("Vendedores")
        .select(
          `
          *,
          usuario:Usuario!inner(*),
          productos:Productos(*)
        `
        )
        .eq("id_vendedor", id_vendedor)
        .single();

      if (error) throw error;
      return data;
    },

    getAll: async () => {
      const { data, error } = await supabase
        .from("Vendedores")
        .select(
          `
          *,
          usuario:Usuario!inner(nombre, telefono, correo)
        `
        )
        .order("nombre");

      if (error) throw error;
      return data;
    },

    update: async (cedula, updates) => {
      const { data, error } = await supabase
        .from("Vendedores")
        .update(updates)
        .eq("cedula", cedula)
        .select();

      if (error) throw error;
      return data[0];
    },

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
  },

  // ===== PRODUCTOS =====
  productos: {
    create: async (productoData) => {
      try {
        // Verificar que el vendedor existe
        const { data: vendedor, error: vendedorError } = await supabase
          .from("Vendedores")
          .select("id_vendedor")
          .eq("id_vendedor", productoData.id_vendedor)
          .single();

        if (vendedorError || !vendedor) {
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

    getAllWithDetails: async (filters = {}) => {
      let query = supabase
        .from("Productos")
        .select(
          `
          *,
          vendedor:Vendedores!inner(
            *,
            usuario:Usuario!inner(nombre, telefono, correo)
          )
        `
        )
        .order("created_at", { ascending: false });

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
          `nombre.ilike.%${filters.searchTerm}%,descripcion.ilike.%${filters.searchTerm}%`
        );
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },

    getByIdWithDetails: async (id_producto) => {
      const { data, error } = await supabase
        .from("Productos")
        .select(
          `
          *,
          vendedor:Vendedores!inner(
            *,
            usuario:Usuario!inner(*)
          )
        `
        )
        .eq("id_producto", id_producto)
        .single();

      if (error) throw error;
      return data;
    },

    getByVendedorId: async (id_vendedor) => {
      const { data, error } = await supabase
        .from("Productos")
        .select("*")
        .eq("id_vendedor", id_vendedor)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },

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

    // Buscar productos
    search: async (searchTerm) => {
      const { data, error } = await supabase
        .from("Productos")
        .select(
          `
          *,
          vendedor:Vendedores!inner(
            *,
            usuario:Usuario!inner(nombre, telefono, correo)
          )
        `
        )
        .or(`nombre.ilike.%${searchTerm}%,descripcion.ilike.%${searchTerm}%`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  },

  // ===== RELACIONES =====
  relaciones: {
    getPerfilCompleto: async (cedula) => {
      try {
        const usuario = await database.usuarios.getByCedula(cedula);
        if (!usuario) return null;

        let vendedor = null;
        let productos = [];

        if (usuario.es_vendedor) {
          vendedor = await database.vendedores.getByCedula(cedula);
          if (vendedor) {
            productos = await database.productos.getByVendedorId(
              vendedor.id_vendedor
            );
          }
        }

        return { usuario, vendedor, productos };
      } catch (error) {
        console.error("Error obteniendo perfil completo:", error);
        throw error;
      }
    },
  },
};

// Funciones de suscripción en tiempo real
export const realtime = {
  subscribeToProductos: (callback) => {
    return supabase
      .channel("productos-cambios")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Productos",
        },
        callback
      )
      .subscribe();
  },

  subscribeToVendedores: (callback) => {
    return supabase
      .channel("vendedores-cambios")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "Vendedores",
        },
        callback
      )
      .subscribe();
  },
};
