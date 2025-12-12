import { useState } from "react";
import { uploadImage, getPublicUrl } from "../services/supabase/storage";

export const useStorage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const upload = async (file, bucket = "images") => {
    setLoading(true);
    setError(null);

    try {
      const data = await uploadImage(file, bucket);
      const url = getPublicUrl(bucket, data.path);
      return { data, url };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, error };
};
