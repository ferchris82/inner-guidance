import { supabase } from '@/lib/supabase';

// Función para verificar y configurar el bucket de imágenes
export const setupImageStorage = async () => {
  try {
    console.log('🔍 Verificando configuración de Supabase Storage...');
    
    // Verificar si el bucket 'images' existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error al listar buckets:', listError);
      return { success: false, error: listError.message };
    }
    
    console.log('📦 Buckets disponibles:', buckets?.map(b => b.name));
    
    const imagesBucket = buckets?.find(bucket => bucket.name === 'images');
    
    if (!imagesBucket) {
      console.log('📦 Bucket "images" no encontrado. Intentando crear...');
      
      // Intentar crear el bucket
      const { data: newBucket, error: createError } = await supabase.storage.createBucket('images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error('❌ Error al crear bucket:', createError);
        return { 
          success: false, 
          error: `No se pudo crear el bucket: ${createError.message}. Por favor, créalo manualmente en el panel de Supabase.` 
        };
      }
      
      console.log('✅ Bucket "images" creado exitosamente');
      return { success: true, message: 'Bucket creado correctamente' };
    } else {
      console.log('✅ Bucket "images" ya existe');
      return { success: true, message: 'Storage configurado correctamente' };
    }
    
  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return { 
      success: false, 
      error: 'Error inesperado al verificar la configuración de storage' 
    };
  }
};

// Función para probar la subida de una imagen pequeña
export const testImageUpload = async () => {
  try {
    // Crear una imagen de prueba muy pequeña (1x1 pixel PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 1, 1);
    }
    
    return new Promise<{ success: boolean; error?: string }>((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          resolve({ success: false, error: 'No se pudo crear imagen de prueba' });
          return;
        }
        
        const file = new File([blob], 'test.png', { type: 'image/png' });
        const testPath = `test/test-${Date.now()}.png`;
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(testPath, file);
        
        if (uploadError) {
          resolve({ success: false, error: uploadError.message });
          return;
        }
        
        // Limpiar archivo de prueba
        await supabase.storage
          .from('images')
          .remove([testPath]);
        
        resolve({ success: true });
      }, 'image/png');
    });
  } catch (error) {
    return { success: false, error: 'Error en prueba de subida' };
  }
};
