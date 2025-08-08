-- Crear tabla para mensajes de contacto
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT DEFAULT 'Sin especificar',
  message TEXT NOT NULL,
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'leido', 'respondido')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar la performance
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages (email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política para permitir insertar mensajes (público puede enviar mensajes)
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Política para que solo usuarios autenticados puedan leer mensajes (para el admin)
-- NOTA: Ajusta esto según tu sistema de autenticación
CREATE POLICY "Authenticated users can view contact messages" ON contact_messages
FOR SELECT 
TO AUTHENTICATED 
USING (true);

-- Política para que solo usuarios autenticados puedan actualizar mensajes (para marcar como leído/respondido)
CREATE POLICY "Authenticated users can update contact messages" ON contact_messages
FOR UPDATE 
TO AUTHENTICATED 
USING (true);

-- Política para que solo usuarios autenticados puedan eliminar mensajes
CREATE POLICY "Authenticated users can delete contact messages" ON contact_messages
FOR DELETE 
TO AUTHENTICATED 
USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE TRIGGER update_contact_messages_updated_at 
    BEFORE UPDATE ON contact_messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentar la tabla
COMMENT ON TABLE contact_messages IS 'Tabla para almacenar mensajes de contacto del formulario web';
COMMENT ON COLUMN contact_messages.id IS 'ID único del mensaje';
COMMENT ON COLUMN contact_messages.name IS 'Nombre completo de quien envía el mensaje';
COMMENT ON COLUMN contact_messages.email IS 'Correo electrónico de contacto';
COMMENT ON COLUMN contact_messages.service IS 'Servicio de interés seleccionado';
COMMENT ON COLUMN contact_messages.message IS 'Contenido del mensaje';
COMMENT ON COLUMN contact_messages.status IS 'Estado del mensaje: nuevo, leido, respondido';
COMMENT ON COLUMN contact_messages.created_at IS 'Fecha y hora de creación del mensaje';
COMMENT ON COLUMN contact_messages.updated_at IS 'Fecha y hora de última actualización';
