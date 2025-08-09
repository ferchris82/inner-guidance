// Servicios para manejar archivos de audio en Supabase Storage
import { supabase } from './supabase';

const STORAGE_BUCKET = 'audio-resources';

// Crear bucket si no existe
export const initializeAudioStorage = async () => {
  try {
    // Verificar si el bucket existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listando buckets:', listError);
      return false;
    }

    const bucketExists = buckets?.some(bucket => bucket.name === STORAGE_BUCKET);
    
    if (!bucketExists) {
      // Crear el bucket
      const { data, error } = await supabase.storage.createBucket(STORAGE_BUCKET, {
        public: true,
        allowedMimeTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/ogg'],
        fileSizeLimit: 52428800 // 50MB
      });

      if (error) {
        console.error('Error creando bucket:', error);
        return false;
      }

      console.log('Bucket de audio creado:', data);
    }

    return true;
  } catch (error) {
    console.error('Error inicializando storage:', error);
    return false;
  }
};

// Subir archivo de audio
export const uploadAudioFile = async (file: File, fileName?: string): Promise<string | null> => {
  try {
    // Generar nombre único si no se proporciona
    const timestamp = Date.now();
    const cleanFileName = fileName || file.name;
    const finalFileName = `${timestamp}-${cleanFileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(finalFileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error subiendo archivo:', error);
      return null;
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error en uploadAudioFile:', error);
    return null;
  }
};

// Eliminar archivo de audio
export const deleteAudioFile = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extraer el path del archivo de la URL
    const urlParts = fileUrl.split(`/${STORAGE_BUCKET}/`);
    if (urlParts.length < 2) return false;
    
    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error('Error eliminando archivo:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error en deleteAudioFile:', error);
    return false;
  }
};

// Obtener información del archivo
export const getAudioFileInfo = async (fileUrl: string) => {
  try {
    const urlParts = fileUrl.split(`/${STORAGE_BUCKET}/`);
    if (urlParts.length < 2) return null;
    
    const filePath = urlParts[1];

    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('', {
        search: filePath
      });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Error obteniendo info del archivo:', error);
    return null;
  }
};

// Listar todos los archivos de audio
export const listAudioFiles = async () => {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list('', {
        limit: 100,
        offset: 0
      });

    if (error) {
      console.error('Error listando archivos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error en listAudioFiles:', error);
    return [];
  }
};
