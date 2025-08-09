import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Crear tabla de categorías (ejecutar esto en Supabase SQL Editor)
export const CREATE_CATEGORIES_TABLE_SQL = `
-- Crear tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_categories_updated_at 
    BEFORE UPDATE ON categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar categorías por defecto
INSERT INTO categories (name, slug, description) VALUES
  ('Llamado Divino', 'llamado-divino', 'Artículos sobre el descubrimiento y cumplimiento del propósito divino'),
  ('Mensaje Profético', 'mensaje-profetico', 'Revelaciones y palabras proféticas para el crecimiento espiritual'),
  ('Propósito Divino', 'proposito-divino', 'Enseñanzas sobre la voluntad de Dios para tu vida'),
  ('Identidad', 'identidad', 'Descubrimiento de la identidad en Cristo'),
  ('Profecía', 'profecia', 'Estudios proféticos y revelaciones bíblicas')
ON CONFLICT (name) DO NOTHING;

-- RLS (Row Level Security) - Solo admins pueden modificar
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy para lectura pública
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Policy para admin (crear/actualizar/eliminar)
-- Nota: Reemplazar con tu lógica de autenticación de admin
CREATE POLICY "Categories are modifiable by admin" ON categories
  FOR ALL USING (
    auth.role() = 'authenticated' 
    -- Aquí puedes agregar lógica adicional para verificar si es admin
  );
`;

// Obtener todas las categorías
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return getLocalCategories(); // Fallback a localStorage
    }

    return data || [];
  } catch (error) {
    console.error('Error in getCategories:', error);
    return getLocalCategories(); // Fallback a localStorage
  }
};

// Crear nueva categoría
export const createCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      throw error;
    }

    // Actualizar cache local
    await syncToLocalStorage();
    
    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    throw error;
  }
};

// Actualizar categoría existente
export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }

    // Actualizar cache local
    await syncToLocalStorage();
    
    return data;
  } catch (error) {
    console.error('Error in updateCategory:', error);
    throw error;
  }
};

// Eliminar categoría
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }

    // Actualizar cache local
    await syncToLocalStorage();
    
    return true;
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    throw error;
  }
};

// Obtener categoría por ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching category by ID:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    return null;
  }
};

// Obtener categoría por slug
export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCategoryBySlug:', error);
    return null;
  }
};

// Obtener nombre de categoría (con cache)
export const getCategoryName = async (id: string): Promise<string> => {
  try {
    // Primero buscar en cache local
    const localCategories = getLocalCategories();
    const localCategory = localCategories.find(cat => cat.id === id);
    if (localCategory) {
      return localCategory.name;
    }

    // Si no está en cache, buscar en Supabase
    const category = await getCategoryById(id);
    return category?.name || id;
  } catch (error) {
    console.error('Error in getCategoryName:', error);
    return id;
  }
};

// Generar slug único
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .trim();
};

// Verificar si slug está disponible
export const isSlugAvailable = async (slug: string, excludeId?: string): Promise<boolean> => {
  try {
    let query = supabase
      .from('categories')
      .select('id')
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query.single();

    if (error && error.code === 'PGRST116') {
      // No rows returned - slug is available
      return true;
    }

    if (error) {
      console.error('Error checking slug availability:', error);
      return false;
    }

    // If data exists, slug is taken
    return !data;
  } catch (error) {
    console.error('Error in isSlugAvailable:', error);
    return false;
  }
};

// Obtener categorías para select (formato para dropdowns)
export const getCategoriesForSelect = async (): Promise<Array<{ value: string; label: string }>> => {
  const categories = await getCategories();
  return categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));
};

// ==========================================
// FUNCIONES DE CACHE LOCAL (FALLBACK)
// ==========================================

const LOCAL_STORAGE_KEY = 'blog_categories_cache';
const LOCAL_STORAGE_TIMESTAMP_KEY = 'blog_categories_cache_timestamp';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Sincronizar datos de Supabase a localStorage como cache
export const syncToLocalStorage = async (): Promise<void> => {
  try {
    const categories = await getCategories();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(categories));
    localStorage.setItem(LOCAL_STORAGE_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error syncing to localStorage:', error);
  }
};

// Obtener categorías desde localStorage (fallback)
export const getLocalCategories = (): Category[] => {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    const timestamp = localStorage.getItem(LOCAL_STORAGE_TIMESTAMP_KEY);
    
    if (cached && timestamp) {
      const cacheAge = Date.now() - parseInt(timestamp);
      if (cacheAge < CACHE_DURATION) {
        return JSON.parse(cached);
      }
    }

    // Cache expirado o no existe, devolver categorías por defecto
    return getDefaultCategories();
  } catch (error) {
    console.error('Error getting local categories:', error);
    return getDefaultCategories();
  }
};

// Categorías por defecto (fallback)
const getDefaultCategories = (): Category[] => {
  return [
    { 
      id: 'llamado-divino', 
      name: 'Llamado Divino', 
      slug: 'llamado-divino', 
      description: 'Artículos sobre el descubrimiento y cumplimiento del propósito divino'
    },
    { 
      id: 'mensaje-profetico', 
      name: 'Mensaje Profético', 
      slug: 'mensaje-profetico', 
      description: 'Revelaciones y palabras proféticas para el crecimiento espiritual'
    },
    { 
      id: 'proposito-divino', 
      name: 'Propósito Divino', 
      slug: 'proposito-divino', 
      description: 'Enseñanzas sobre la voluntad de Dios para tu vida'
    },
    { 
      id: 'identidad', 
      name: 'Identidad', 
      slug: 'identidad', 
      description: 'Descubrimiento de la identidad en Cristo'
    },
    { 
      id: 'profecia', 
      name: 'Profecía', 
      slug: 'profecia', 
      description: 'Estudios proféticos y revelaciones bíblicas'
    }
  ];
};
