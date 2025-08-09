-- Script para configurar Supabase Storage para archivos de audio
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. Crear el bucket para archivos de audio (si no existe)
-- Nota: También puedes hacer esto desde la interfaz de Storage en Supabase
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
VALUES (
  'audio-resources',
  'audio-resources', 
  true,
  false,
  52428800, -- 50MB en bytes
  ARRAY['audio/mpeg','audio/mp3','audio/wav','audio/m4a','audio/ogg']
)
ON CONFLICT (id) DO NOTHING;

-- Eliminar políticas existentes si existen (para evitar errores de duplicación)
DROP POLICY IF EXISTS "Allow public read access to audio files" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload for development" ON storage.objects;
DROP POLICY IF EXISTS "Allow update for development" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete for development" ON storage.objects;

-- 2. Política para permitir lectura pública de archivos
CREATE POLICY "Allow public read access to audio files" ON storage.objects
FOR SELECT USING (bucket_id = 'audio-resources');

-- 3. Política para permitir subida de archivos (sin autenticación para desarrollo)
-- NOTA: En producción, deberías limitar esto a usuarios autenticados
CREATE POLICY "Allow upload for development" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'audio-resources');

-- 4. Política para permitir actualización de archivos
CREATE POLICY "Allow update for development" ON storage.objects
FOR UPDATE USING (bucket_id = 'audio-resources')
WITH CHECK (bucket_id = 'audio-resources');

-- 5. Política para permitir eliminación de archivos
CREATE POLICY "Allow delete for development" ON storage.objects
FOR DELETE USING (bucket_id = 'audio-resources');

-- Verificar que el bucket se creó correctamente
SELECT * FROM storage.buckets WHERE id = 'audio-resources';

-- Ver las políticas creadas
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
