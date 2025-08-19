import { supabase } from '@/lib/supabase';
import { isAuthenticated } from '@/utils/auth';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

// Función para subir imagen a Supabase Storage
export const uploadImage = async (file: File): Promise<UploadResult> => {
  try {
    // Verificar autenticación local (tu sistema)
    const localAuthStatus = isAuthenticated();
    
    console.log('🔐 Estado de autenticación local:', localAuthStatus);
    
    if (!localAuthStatus) {
      return {
        success: false,
        error: '🔐 Necesitas estar autenticado para subir imágenes. Por favor, inicia sesión en el admin.'
      };
    }

    // Verificar conexión con Supabase (opcional)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('📡 Estado Supabase:', { user: user ? 'Conectado' : 'Sin usuario', authError });

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'El archivo debe ser una imagen'
      };
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'La imagen debe ser menor a 5MB'
      };
    }

    // Generar nombre único para el archivo
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `blog-images/${fileName}`;

    console.log('🔄 Subiendo imagen:', { 
      fileName, 
      fileSize: file.size, 
      localAuth: localAuthStatus,
      supabaseUser: user ? user.id : 'none'
    });

    // Subir archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Error uploading image:', error);
      console.error('📋 Error details:', {
        message: error.message,
        name: error.name
      });
      
      // Error específico para bucket no encontrado
      if (error.message.includes('Bucket not found')) {
        return {
          success: false,
          error: `❌ Bucket 'images' no encontrado en Supabase Storage.`
        };
      }
      
      // Error específico para políticas RLS
      if (error.message.includes('row-level security policy') || error.message.includes('RLS')) {
        return {
          success: false,
          error: `🔐 Error de políticas RLS. 
          
Tu app usa autenticación local, pero Supabase Storage requiere políticas públicas.

✅ SOLUCIÓN: Ejecuta esto en SQL Editor de Supabase:

DROP POLICY "Authenticated users can upload images" ON storage.objects;
CREATE POLICY "Public upload for images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');

Esto permitirá subir imágenes sin autenticación de Supabase.`
        };
      }
      
      // Error de permisos genérico
      if (error.message.includes('permission') || error.message.includes('denied')) {
        return {
          success: false,
          error: `🚫 Permisos denegados. 
          
Como usas autenticación local, necesitas políticas públicas en Supabase Storage.
          
Error: ${error.message}`
        };
      }
      
      return {
        success: false,
        error: `Error al subir la imagen: ${error.message}`
      };
    }

    console.log('✅ Imagen subida exitosamente:', data);

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    console.log('🔗 URL pública generada:', publicUrl);
    console.log('🔍 DEBUG - publicUrl type:', typeof publicUrl);
    console.log('🔍 DEBUG - publicUrl length:', publicUrl?.length);
    console.log('🔍 DEBUG - publicUrl starts with http:', publicUrl?.startsWith('http'));

    return {
      success: true,
      url: publicUrl
    };

  } catch (error) {
    console.error('💥 Error inesperado in uploadImage:', error);
    return {
      success: false,
      error: 'Error inesperado al subir la imagen'
    };
  }
};

// Función para eliminar imagen de Supabase Storage
export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extraer el path del archivo de la URL
    const urlParts = url.split('/');
    const bucketIndex = urlParts.findIndex(part => part === 'images');
    if (bucketIndex === -1) return false;
    
    const filePath = urlParts.slice(bucketIndex + 1).join('/');
    
    const { error } = await supabase.storage
      .from('images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteImage:', error);
    return false;
  }
};

// Función para convertir enlaces de Google Drive al formato correcto
export const convertGoogleDriveUrl = (url: string): string => {
  // Detectar si es un enlace de Google Drive
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);
  
  if (match) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  
  return url; // Si no es de Google Drive, devolver la URL original
};

// Función para validar si una URL es una imagen válida
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    // Convertir URL de Google Drive si es necesario
    const convertedUrl = convertGoogleDriveUrl(url);
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = convertedUrl;
    });
  } catch {
    return false;
  }
};
