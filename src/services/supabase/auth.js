// src/services/supabase/auth.js
import { supabase } from "./Client";
import { database } from "./database";

export const authService = {
  // Registro completo: Usuario + Vendedor (si aplica)
  signUp: async (userData, esVendedor = false, vendedorData = null) => {
    try {
      const { cedula, email, password, nombre, telefono } = userData;

      // 1. Verificar que la cédula no exista en Usuarios
      const { data: existingUser } = await supabase
        .from("Usuarios")
        .select("cedula")
        .eq("cedula", cedula)
        .single();

      if (existingUser) {
        throw new Error("La cédula ya está registrada");
      }

      // 2. Registrar en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { cedula, nombre, telefono },
        },
      });

      if (authError) throw authError;

      // 3. Crear registro en tabla Usuarios
      const { error: userError } = await supabase.from("Usuarios").insert([
        {
          cedula: cedula,
          nombre: nombre,
          telefono: telefono,
          correo: email,
          auth_id: authData.user.id,
          es_vendedor: esVendedor,
        },
      ]);

      if (userError) {
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw userError;
      }

      // 4. Si es vendedor, crear registro en Vendedores
      let vendedorId = null;
      if (esVendedor && vendedorData) {
        const vendedor = await database.vendedores.create({
          cedula: cedula, // Llave foránea
          nombre: vendedorData.nombre || nombre,
          direccion: vendedorData.direccion,
          telefono: vendedorData.telefono || telefono,
        });
        vendedorId = vendedor.id_vendedor;

        // Actualizar Usuario para marcar como vendedor
        await supabase
          .from("Usuarios")
          .update({ es_vendedor: true })
          .eq("cedula", cedula);
      }

      return {
        success: true,
        user: authData.user,
        vendedorId,
      };
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  },

  // Convertir usuario existente en vendedor
  convertToVendedor: async (cedula, vendedorData) => {
    try {
      // 1. Verificar que el usuario existe
      const usuario = await database.usuarios.getByCedula(cedula);
      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }

      // 2. Verificar que no sea ya vendedor
      if (usuario.es_vendedor) {
        throw new Error("El usuario ya es vendedor");
      }

      // 3. Crear registro en Vendedores
      const vendedor = await database.vendedores.create({
        cedula: cedula,
        nombre: vendedorData.nombre || usuario.nombre,
        direccion: vendedorData.direccion,
        telefono: vendedorData.telefono || usuario.telefono,
        // Otros campos específicos de vendedor
        ...vendedorData,
      });

      // 4. Actualizar Usuario para marcar como vendedor
      await database.usuarios.update(cedula, { es_vendedor: true });

      return {
        success: true,
        vendedor,
        usuario,
      };
    } catch (error) {
      console.error("Error al convertir en vendedor:", error);
      throw error;
    }
  },

  // Obtener datos completos del usuario
  getUserProfile: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Obtener datos de Usuarios
    const { data: usuarioData, error } = await supabase
      .from("Usuarios")
      .select("*")
      .eq("auth_id", user.id)
      .single();

    if (error) throw error;

    let vendedorData = null;
    // Si es vendedor, obtener datos de Vendedores
    if (usuarioData.es_vendedor) {
      const { data: vendedor } = await supabase
        .from("Vendedores")
        .select("*")
        .eq("cedula", usuarioData.cedula)
        .single();

      vendedorData = vendedor;
    }

    return {
      ...user,
      cedula: usuarioData.cedula,
      telefono: usuarioData.telefono,
      es_vendedor: usuarioData.es_vendedor,
      usuario: usuarioData,
      vendedor: vendedorData,
    };
  },

  // Resto de funciones permanecen igual
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};
