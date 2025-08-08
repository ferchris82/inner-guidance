-- Crear tabla para suscriptores del newsletter
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  source TEXT DEFAULT 'website' -- para rastrear de dónde vino la suscripción
);

-- Crear índices para mejorar la performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers (email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_status ON newsletter_subscribers (status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers (subscribed_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Política para permitir insertar suscripciones (público puede suscribirse)
CREATE POLICY "Allow anonymous insert for newsletter" ON newsletter_subscribers
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Política para permitir insertar suscripciones a usuarios autenticados también
CREATE POLICY "Allow authenticated insert for newsletter" ON newsletter_subscribers
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Política para que solo usuarios autenticados puedan leer suscriptores (para el admin)
CREATE POLICY "Allow authenticated select for newsletter" ON newsletter_subscribers
FOR SELECT 
TO authenticated 
USING (true);

-- Política para que solo usuarios autenticados puedan actualizar suscriptores
CREATE POLICY "Allow authenticated update for newsletter" ON newsletter_subscribers
FOR UPDATE 
TO authenticated 
USING (true);

-- Política para que solo usuarios autenticados puedan eliminar suscriptores
CREATE POLICY "Allow authenticated delete for newsletter" ON newsletter_subscribers
FOR DELETE 
TO authenticated 
USING (true);

-- Función para manejar la fecha de cancelación automáticamente
CREATE OR REPLACE FUNCTION update_unsubscribed_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'unsubscribed' AND OLD.status = 'active' THEN
        NEW.unsubscribed_at = NOW();
    ELSIF NEW.status = 'active' AND OLD.status = 'unsubscribed' THEN
        NEW.unsubscribed_at = NULL;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar unsubscribed_at automáticamente
CREATE OR REPLACE TRIGGER update_newsletter_unsubscribed_at 
    BEFORE UPDATE ON newsletter_subscribers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_unsubscribed_at();

-- Comentarios para documentar la tabla
COMMENT ON TABLE newsletter_subscribers IS 'Tabla para almacenar suscriptores del newsletter';
COMMENT ON COLUMN newsletter_subscribers.id IS 'ID único del suscriptor';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Correo electrónico del suscriptor (único)';
COMMENT ON COLUMN newsletter_subscribers.status IS 'Estado de la suscripción: active, unsubscribed';
COMMENT ON COLUMN newsletter_subscribers.subscribed_at IS 'Fecha y hora de suscripción';
COMMENT ON COLUMN newsletter_subscribers.unsubscribed_at IS 'Fecha y hora de cancelación (si aplica)';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Fuente de la suscripción (website, footer, etc.)';
