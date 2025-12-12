// src/services/api/productImageService.js
import { supabase } from "../supabase/Client";

class ProductImageService {
  async uploadProductImage(file, productId, vendedorId) {
    try {
      console.log("🟡 Iniciando subida de imagen...");
      console.log("Archivo:", file.name, "Tamaño:", file.size);
      console.log("Producto ID:", productId);
      console.log("Vendedor ID:", vendedorId);

      // Validar archivo
      if (!file || !file.type.startsWith("image/")) {
        throw new Error("El archivo debe ser una imagen (JPG, PNG, GIF, etc.)");
      }

      // Tamaño máximo: 5MB
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        throw new Error(
          `La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(
            2
          )}MB). Máximo: 5MB`
        );
      }

      // Generar nombre único para evitar conflictos
      const fileExt = file.name.split(".").pop();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 9);
      const fileName = `producto-${productId}-${timestamp}-${randomStr}.${fileExt}`;
      const filePath = `productos/${vendedorId}/${fileName}`;

      console.log("📁 Subiendo a:", filePath);

      // 1. Subir imagen al bucket de Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images") // Asegúrate que este bucket existe
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error("❌ Error subiendo imagen:", uploadError);
        throw new Error(`Error al subir la imagen: ${uploadError.message}`);
      }

      console.log("✅ Imagen subida exitosamente:", uploadData);

      // 2. Obtener URL pública de la imagen
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      console.log("🔗 URL pública generada:", publicUrl);

      // 3. Actualizar el producto con la URL de la imagen
      const { data: updatedProduct, error: updateError } = await supabase
        .from("Productos")
        .update({
          imagen_url: publicUrl,
        })
        .eq("id_producto", productId)
        .select() // Esto devuelve el producto actualizado
        .single();

      if (updateError) {
        console.error(
          "❌ Error actualizando producto con imagen:",
          updateError
        );

        // Intentar eliminar la imagen subida si falla la actualización
        try {
          await supabase.storage.from("images").remove([filePath]);
          console.log("🗑️ Imagen eliminada por fallo en actualización");
        } catch (deleteError) {
          console.error("⚠️ No se pudo eliminar la imagen:", deleteError);
        }

        throw new Error(
          `Error al guardar la URL de la imagen: ${updateError.message}`
        );
      }

      console.log("✅ Producto actualizado con imagen:", updatedProduct);

      return {
        success: true,
        url: publicUrl,
        path: filePath,
        product: updatedProduct,
      };
    } catch (error) {
      console.error("❌ Error en uploadProductImage:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Obtener URL de imagen con opciones
  getImageUrl(product, options = {}) {
    if (!product || !product.imagen_url) {
      // Imagen por defecto si no hay
      return (
        options.defaultImage ||
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
      );
    }

    let imageUrl = product.imagen_url;

    // Aplicar transformaciones de CDN si están disponibles
    if (options.width || options.height || options.quality) {
      const url = new URL(imageUrl);
      const params = new URLSearchParams();

      if (options.width) params.append("width", options.width);
      if (options.height) params.append("height", options.height);
      if (options.quality) params.append("quality", options.quality);
      if (options.resize) params.append("resize", options.resize);

      if (params.toString()) {
        imageUrl = `${imageUrl}?${params.toString()}`;
      }
    }

    return imageUrl;
  }

  // Eliminar imagen
  async deleteProductImage(imageUrl, productId = null) {
    try {
      console.log("🟡 Eliminando imagen:", imageUrl);

      // Extraer el path de la URL de Supabase Storage
      const urlParts = imageUrl.split("/");
      const bucketIndex = urlParts.findIndex(
        (part) => part === "storage" || part === "supabase.co"
      );

      if (bucketIndex === -1) {
        throw new Error("URL de imagen no válida");
      }

      // La estructura típica es: https://xxx.supabase.co/storage/v1/object/public/images/path/to/file.jpg
      const filePath = urlParts.slice(bucketIndex + 4).join("/"); // Saltar 'storage/v1/object/public/images'

      console.log("📁 Ruta a eliminar:", filePath);

      // Eliminar de Storage
      const { error: storageError } = await supabase.storage
        .from("images")
        .remove([filePath]);

      if (storageError) {
        console.error("❌ Error eliminando de storage:", storageError);
        throw storageError;
      }

      // Si se proporciona productId, actualizar el producto para quitar la URL
      if (productId) {
        const { error: updateError } = await supabase
          .from("Productos")
          .update({
            imagen_url: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id_producto", productId);

        if (updateError) {
          console.error("⚠️ Error quitando URL del producto:", updateError);
          // No lanzamos error, solo registramos
        }
      }

      console.log("✅ Imagen eliminada exitosamente");
      return { success: true };
    } catch (error) {
      console.error("❌ Error en deleteProductImage:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export const productImageService = new ProductImageService();
