// src/services/supabase/Client.js (o client.js)
import { createClient } from "@supabase/supabase-js";

// En Vite usamos import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// Validar que las variables existan
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Faltan variables de entorno de Supabase");
  console.log("URL:", supabaseUrl ? "✓" : "✗");
  console.log("KEY:", supabaseAnonKey ? "✓" : "✗");

  // Si estás en desarrollo, muestra ayuda
  if (import.meta.env.DEV) {
    console.log("\n📝 Crea un archivo .env con:");
    console.log("VITE_SUPABASE_URL=tu_url_de_supabase");
    console.log("VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=tu_clave_anonima");
  }
}

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
