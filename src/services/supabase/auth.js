// src/services/supabase/auth.js
import { supabase } from "./Client";
import { database } from "./database";

export const authService = {
  // Registro básico de usuario
  signUp: async (userData) => {
    try {
      const { cedula, email, password, nombre, telefono } = userData;

      // 1. Verificar que la cédula no exista
      const { data: existingUser } = await supabase
        .from("Usuario")
        .select("cedula")
        .eq("cedula", cedula)
        .single();

      if (existingUser) {
        throw new Error("La cédula ya está registrada");
      }

      // 2. Registrar en Supabase Auth con redirección para confirmación
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { cedula, nombre, telefono },
          emailRedirectTo: `${window.location.origin}/auth/callback`, // IMPORTANTE
        },
      });

      if (authError) {
        // Si es error de email ya registrado pero no confirmado
        if (
          authError.message.includes("already registered") ||
          authError.message.includes("user_already_exists")
        ) {
          // Reenviar correo de verificación
          const { error: resendError } = await supabase.auth.resend({
            type: "signup",
            email: email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (resendError) {
            throw new Error(
              `No se pudo reenviar el correo de verificación. Error: ${resendError.message}`
            );
          }

          // Lanzar error especial para mostrar alerta
          throw {
            type: "EMAIL_VERIFICATION_RESENT",
            message: "Se ha reenviado el correo de verificación a tu email.",
            email: email,
          };
        }
        throw authError;
      }

      // 3. Si el registro fue exitoso pero necesita confirmación
      if (authData.user && !authData.user.email_confirmed_at) {
        // Crear objeto especial para alerta
        const verificationResult = {
          success: true,
          needsVerification: true,
          message:
            "Se ha enviado un correo de verificación a tu email. Por favor, confírmalo antes de iniciar sesión.",
          email: email,
          user: authData.user,
        };

        // Intentar crear usuario en tabla Usuario (podría fallar si email no confirmado)
        try {
          const { error: userError } = await supabase.from("Usuario").insert([
            {
              cedula: cedula,
              nombre: nombre,
              telefono: telefono,
              correo: email,
              auth_id: authData.user.id,
              es_vendedor: false,
            },
          ]);

          if (userError) {
            console.warn(
              "Usuario creado en Auth pero no en tabla Usuario:",
              userError
            );
            // No lanzamos error, solo registramos
          }
        } catch (dbError) {
          console.warn("Error creando usuario en tabla:", dbError);
        }

        return verificationResult;
      }

      // 4. Si el email ya estaba confirmado (raro pero posible)
      // Crear registro en tabla Usuario
      const { error: userError } = await supabase.from("Usuario").insert([
        {
          cedula: cedula,
          nombre: nombre,
          telefono: telefono,
          correo: email,
          auth_id: authData.user.id,
          es_vendedor: false,
        },
      ]);

      if (userError) {
        if (authData.user) {
          await supabase.auth.admin.deleteUser(authData.user.id);
        }
        throw userError;
      }

      return {
        success: true,
        user: authData.user,
        needsVerification: false,
      };
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  },

  // Iniciar sesión con manejo especial para email no confirmado
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Verificar si es error de email no confirmado
        if (
          error.message.includes("Email not confirmed") ||
          error.message.includes("email_not_confirmed") ||
          error.message.includes("Not confirmed")
        ) {
          console.log(
            "📧 Email no confirmado, reenviando correo de verificación..."
          );

          // Reenviar correo de verificación
          const { error: resendError } = await supabase.auth.resend({
            type: "signup",
            email: email,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (resendError) {
            console.error("Error reenviando correo:", resendError);
            throw new Error(
              `Tu email no está confirmado. Error reenviando correo: ${resendError.message}`
            );
          }

          // Lanzar error especial para mostrar alerta
          throw {
            type: "EMAIL_NOT_CONFIRMED",
            message:
              "Tu email no está confirmado. Se ha reenviado un nuevo correo de verificación.",
            email: email,
          };
        }

        // Otros errores normales
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error en signIn:", error);
      throw error;
    }
  },

  // Función específica para reenviar correo de verificación
  resendVerificationEmail: async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // Si el usuario no existe, podría ser porque ya está confirmado
        if (error.message.includes("user not found")) {
          return {
            success: true,
            message:
              "Tu email ya podría estar confirmado. Intenta iniciar sesión nuevamente.",
          };
        }
        throw error;
      }

      return {
        success: true,
        message:
          "Se ha reenviado el correo de verificación. Revisa tu bandeja de entrada.",
        email: email,
      };
    } catch (error) {
      console.error("Error reenviando correo:", error);
      throw error;
    }
  },

  // Convertir usuario en vendedor
  convertToVendedor: async (vendedorData) => {
    try {
      // Obtener usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("No hay usuario autenticado");
      }

      // Obtener cédula del usuario
      const cedula = user.user_metadata?.cedula;
      if (!cedula) {
        throw new Error("No se encontró la cédula del usuario");
      }

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
        descripcion: vendedorData.descripcion || "",
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

  // Obtener perfil completo del usuario
  getUserProfile: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return null;

      // Obtener datos de Usuario
      const { data: usuarioData, error: userError } = await supabase
        .from("Usuario")
        .select("*")
        .eq("auth_id", user.id)
        .single();

      if (userError) {
        console.error("Error obteniendo usuario:", userError);
        return { ...user, cedula: user.user_metadata?.cedula };
      }

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
    } catch (error) {
      console.error("Error en getUserProfile:", error);
      return null;
    }
  },

  // Cerrar sesión
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obtener sesión actual
  getSession: async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data;
  },

  // Verificar si hay usuario autenticado
  isAuthenticated: async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session;
  },

  // Restablecer contraseña
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  // Verificar estado de confirmación de email
  checkEmailConfirmation: async (email) => {
    try {
      // Esta función intenta verificar si un email está confirmado
      // Nota: No hay API directa, pero podemos intentar obtener el usuario
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;

      return {
        email: user?.email,
        confirmed: !!user?.email_confirmed_at,
        confirmedAt: user?.email_confirmed_at,
      };
    } catch (error) {
      console.error("Error verificando confirmación:", error);
      throw error;
    }
  },
};
