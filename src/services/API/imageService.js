// src/services/api/imageService.js
import { supabase } from "../supabase/Client";
import Compressor from "compressorjs";

// Configuración
const DEFAULT_BUCKET = "images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

class ImageService {
  // Validar archivo antes de subir
  validateFile(file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Tipo de archivo no permitido");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("El archivo es demasiado grande (máx 5MB)");
    }

    return true;
  }

  // Comprimir imagen
  compressImage(file, options = {}) {
    return new Promise((resolve, reject) => {
      new Compressor(file, {
        quality: options.quality || 0.8,
        maxWidth: options.maxWidth || 1200,
        maxHeight: options.maxHeight || 1200,
        convertSize: 1000000, // Convertir a WebP si > 1MB
        success: resolve,
        error: reject,
      });
    });
  }

  // Generar nombre único para el archivo
  generateFileName(file, prefix = "") {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop();
    return `${prefix}${timestamp}-${randomString}.${extension}`;
  }

  // Subir imagen a Supabase Storage
  async uploadImage(file, options = {}) {
    try {
      // Validar
      this.validateFile(file);

      // Configuración
      const bucket = options.bucket || DEFAULT_BUCKET;
      const folder = options.folder || "public";
      const shouldCompress = options.compress !== false;
      const customName = options.customName;

      let fileToUpload = file;

      // Comprimir si es necesario
      if (shouldCompress) {
        fileToUpload = await this.compressImage(file, options.compressOptions);
      }

      // Generar nombre de archivo
      const fileName =
        customName || this.generateFileName(file, options.prefix);
      const filePath = `${folder}/${fileName}`;

      // Subir a Supabase
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, fileToUpload, {
          cacheControl: options.cacheControl || "3600",
          upsert: options.upsert || false,
          contentType: fileToUpload.type,
        });

      if (error) throw error;

      // Obtener URL pública
      const url = this.getPublicUrl(bucket, filePath);

      // Si se solicita, guardar referencia en la base de datos
      if (options.saveToDatabase) {
        await this.saveImageMetadata({
          url,
          path: filePath,
          bucket,
          filename: fileName,
          original_name: file.name,
          size: fileToUpload.size,
          type: fileToUpload.type,
          user_id: options.userId,
        });
      }

      return {
        success: true,
        data,
        url,
        path: filePath,
        filename: fileName,
      };
    } catch (error) {
      console.error("Error en uploadImage:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Obtener URL pública
  getPublicUrl(bucket, filePath) {
    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return data.publicUrl;
  }

  // Obtener URL firmada (para archivos privados)
  async getSignedUrl(bucket, filePath, expiresIn = 3600) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) throw error;
    return data.signedUrl;
  }

  // Guardar metadatos de la imagen en la base de datos
  async saveImageMetadata(metadata) {
    const { data, error } = await supabase
      .from("images")
      .insert([metadata])
      .select();

    if (error) throw error;
    return data;
  }

  // Listar imágenes del usuario
  async getUserImages(userId, options = {}) {
    let query = supabase
      .from("images")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }

  // Eliminar imagen
  async deleteImage(bucket, filePath, deleteFromDatabase = true) {
    try {
      // Eliminar de Storage
      const { error: storageError } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (storageError) throw storageError;

      // Eliminar de la base de datos si es necesario
      if (deleteFromDatabase) {
        const { error: dbError } = await supabase
          .from("images")
          .delete()
          .eq("path", filePath);

        if (dbError) throw dbError;
      }

      return { success: true };
    } catch (error) {
      console.error("Error en deleteImage:", error);
      return { success: false, error: error.message };
    }
  }

  // Subir múltiples imágenes
  async uploadMultipleImages(files, options = {}) {
    const uploadPromises = files.map((file) => this.uploadImage(file, options));

    const results = await Promise.allSettled(uploadPromises);

    const successful = results
      .filter((result) => result.status === "fulfilled" && result.value.success)
      .map((result) => result.value);

    const failed = results.filter(
      (result) => result.status === "rejected" || !result.value.success
    );

    return {
      successful,
      failed,
      total: files.length,
      successCount: successful.length,
      failCount: failed.length,
    };
  }

  // Optimizar URL de imagen (para CDN)
  optimizeImageUrl(url, options = {}) {
    if (!url) return url;

    // Aquí puedes agregar transformaciones de CDN si Supabase las soporta
    // Por ejemplo, para resizing, cropping, etc.
    let optimizedUrl = url;

    if (options.width || options.height) {
      optimizedUrl += `?width=${options.width || ""}&height=${
        options.height || ""
      }`;
    }

    if (options.quality) {
      optimizedUrl += `${optimizedUrl.includes("?") ? "&" : "?"}quality=${
        options.quality
      }`;
    }

    return optimizedUrl;
  }
}

// Exportar instancia única
export const imageService = new ImageService();
