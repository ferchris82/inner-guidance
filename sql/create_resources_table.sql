-- Crear tabla de recursos para podcasts, videos de YouTube y otros recursos

-- Tabla principal de recursos
CREATE TABLE IF NOT EXISTS resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('podcast', 'youtube', 'pdf', 'audio', 'video_series', 'study')),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    featured BOOLEAN DEFAULT false,
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_resources_active ON resources(active);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON resources(featured);
CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_order ON resources(order_index);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at);

-- RLS (Row Level Security) - Deshabilitado para permitir acceso público de lectura
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen (para evitar errores de duplicación)
DROP POLICY IF EXISTS "Allow public read access to active resources" ON resources;
DROP POLICY IF EXISTS "Allow full access for now" ON resources;

-- Política para permitir lectura pública (solo recursos activos)
CREATE POLICY "Allow public read access to active resources" ON resources
    FOR SELECT
    TO PUBLIC
    USING (active = true);

-- Política para permitir todas las operaciones sin autenticación (para desarrollo)
-- NOTA: En producción, deberías implementar autenticación adecuada
CREATE POLICY "Allow full access for now" ON resources
    FOR ALL
    TO PUBLIC
    USING (true)
    WITH CHECK (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS trigger_resources_updated_at ON resources;
CREATE TRIGGER trigger_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_resources_updated_at();

-- Insertar datos de ejemplo (recursos por defecto)
INSERT INTO resources (title, description, type, url, thumbnail_url, featured, active, order_index, metadata) VALUES
(
    'Guía de Oración Profética',
    'Manual completo para desarrollar tu vida de oración y escuchar la voz de Dios con claridad.',
    'pdf',
    '/resources/guia-oracion-profetica.pdf',
    'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop',
    true,
    true,
    1,
    '{"author": "Maité", "file_size": "2.5 MB"}'::jsonb
),
(
    'Serie: Descubriendo tu Propósito',
    '5 videos de enseñanza sobre cómo identificar y activar el llamado divino en tu vida.',
    'video_series',
    'https://youtube.com/playlist?list=example',
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    false,
    true,
    2,
    '{"duration": "2 horas", "series_name": "Descubriendo tu Propósito"}'::jsonb
),
(
    'Estudio Bíblico: Identidad en Cristo',
    'Estudio profundo de 8 semanas sobre quiénes somos en Cristo y nuestra identidad espiritual.',
    'study',
    '/resources/estudio-identidad-cristo.pdf',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
    false,
    true,
    3,
    '{"author": "Maité", "duration": "8 semanas"}'::jsonb
),
(
    'Meditaciones Guiadas',
    'Audio meditaciones para la conexión espiritual y el crecimiento en intimidad con Dios.',
    'audio',
    '/resources/meditaciones-guiadas.mp3',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    false,
    true,
    4,
    '{"duration": "45 minutos", "author": "Maité"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Comentarios para documentación
COMMENT ON TABLE resources IS 'Tabla para almacenar todos los recursos (podcasts, videos de YouTube, PDFs, etc.)';
COMMENT ON COLUMN resources.type IS 'Tipo de recurso: podcast, youtube, pdf, audio, video_series, study';
COMMENT ON COLUMN resources.metadata IS 'Metadatos específicos del tipo de recurso (duración, autor, etc.)';
COMMENT ON COLUMN resources.featured IS 'Si el recurso está destacado en la sección principal';
COMMENT ON COLUMN resources.active IS 'Si el recurso está activo y visible para los usuarios';
COMMENT ON COLUMN resources.order_index IS 'Índice para ordenar los recursos en la interfaz';
