-- ===============================================
-- FIX PARA ROW LEVEL SECURITY (RLS) - CONTACT MESSAGES
-- ===============================================
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contact_messages';

-- 2. Ver políticas actuales
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'contact_messages';

-- 3. Deshabilitar RLS para permitir operaciones públicas
-- (Recomendado para un blog personal donde el admin maneja los contactos)
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;

-- 4. Alternativamente, si prefieres mantener RLS habilitado con políticas públicas:
/*
-- Eliminar políticas restrictivas existentes
DROP POLICY IF EXISTS "Public can read contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can manage contact messages" ON contact_messages;

-- Crear política de acceso público total
CREATE POLICY "Public can manage contact messages" ON contact_messages
  FOR ALL USING (true);

-- Mantener RLS habilitado
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
*/

-- 5. Verificar que los cambios se aplicaron
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'contact_messages';

-- 6. Test básico de funcionamiento
SELECT COUNT(*) as total_messages FROM contact_messages;
