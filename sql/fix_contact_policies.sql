-- Script para corregir las políticas RLS de la tabla contact_messages

-- Primero, eliminar las políticas existentes si existen
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can view contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update contact messages" ON contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete contact messages" ON contact_messages;

-- Crear nueva política para permitir insertar a usuarios anónimos (formulario público)
CREATE POLICY "Allow anonymous insert" ON contact_messages
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Crear nueva política para permitir insertar a usuarios autenticados también
CREATE POLICY "Allow authenticated insert" ON contact_messages
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política para que solo usuarios autenticados puedan leer mensajes (para el admin)
CREATE POLICY "Allow authenticated select" ON contact_messages
FOR SELECT 
TO authenticated 
USING (true);

-- Política para que solo usuarios autenticados puedan actualizar mensajes
CREATE POLICY "Allow authenticated update" ON contact_messages
FOR UPDATE 
TO authenticated 
USING (true);

-- Política para que solo usuarios autenticados puedan eliminar mensajes
CREATE POLICY "Allow authenticated delete" ON contact_messages
FOR DELETE 
TO authenticated 
USING (true);

-- Verificar que RLS esté habilitado
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
