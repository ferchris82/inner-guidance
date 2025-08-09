-- ===============================================
-- FIX PARA ROW LEVEL SECURITY (RLS) - CATEGORIES
-- ===============================================
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar políticas restrictivas existentes
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Authenticated users can manage categories" ON categories;

-- 2. Crear políticas públicas para categorías (son contenido público)
-- Permitir lectura pública
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

-- Permitir escritura pública (crear, actualizar, eliminar)
-- En producción, puedes restringir esto solo a administradores
CREATE POLICY "Public can write categories" ON categories
  FOR ALL USING (true);

-- 3. Alternativamente, si quieres más seguridad:
-- Solo descomenta las siguientes líneas y comenta las anteriores

/*
-- Solo lectura pública, escritura para autenticados
CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can write categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');
*/

-- 4. Verificar que RLS esté habilitado
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 5. Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'categories';
