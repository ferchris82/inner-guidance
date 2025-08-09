-- Script para actualizar las miniaturas de los recursos existentes
-- Ejecutar esto en el SQL Editor de Supabase si ya tienes recursos sin miniaturas

-- Actualizar miniaturas usando imágenes de Unsplash (apropiadas para contenido espiritual)
UPDATE resources 
SET thumbnail_url = 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=300&fit=crop'
WHERE title = 'Guía de Oración Profética' AND thumbnail_url IS NULL;

UPDATE resources 
SET thumbnail_url = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'
WHERE title = 'Serie: Descubriendo tu Propósito' AND thumbnail_url IS NULL;

UPDATE resources 
SET thumbnail_url = 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop'
WHERE title = 'Estudio Bíblico: Identidad en Cristo' AND thumbnail_url IS NULL;

UPDATE resources 
SET thumbnail_url = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
WHERE title = 'Meditaciones Guiadas' AND thumbnail_url IS NULL;

-- Ver los recursos actualizados
SELECT title, thumbnail_url, type FROM resources ORDER BY order_index;
