-- Agregar campo featured_image a la tabla blog_posts
ALTER TABLE blog_posts 
ADD COLUMN featured_image TEXT;

-- Verificar que se agregó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
ORDER BY ordinal_position;
