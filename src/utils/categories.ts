import { supabase } from '@/lib/supabase';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  article_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Obtener todas las categorías
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return getDefaultCategories();
    }

    return data || getDefaultCategories();
  } catch (error) {
    console.error('Error in getCategories:', error);
    return getDefaultCategories();
  }
};

// Crear nueva categoría
export const createCategory = async (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name: category.name,
        slug: category.slug,
        description: category.description,
        article_count: 0
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createCategory:', error);
    return null;
  }
};

// Actualizar categoría
export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update({
        name: updates.name,
        slug: updates.slug,
        description: updates.description,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateCategory:', error);
    return null;
  }
};

// Eliminar categoría
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }

    if (data && data.length === 0) {
      console.warn('No rows were deleted. Category may not exist:', id);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    return false;
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
      console.error('Error fetching category by id:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getCategoryById:', error);
    return null;
  }
};

// Obtener nombre de categoría por ID (función síncrona con cache)
export const getCategoryName = (id: string, categories?: Category[]): string => {
  if (categories) {
    const category = categories.find(cat => cat.id === id);
    return category?.name || id;
  }
  return id;
};

// Actualizar contador de artículos de una categoría
export const updateCategoryArticleCount = async (categoryId: string, increment: number): Promise<boolean> => {
  try {
    // Primero obtener el contador actual
    const { data: category, error: fetchError } = await supabase
      .from('categories')
      .select('article_count')
      .eq('id', categoryId)
      .single();

    if (fetchError) {
      console.error('Error fetching category count:', fetchError);
      return false;
    }

    const currentCount = category?.article_count || 0;
    const newCount = Math.max(0, currentCount + increment); // No permitir valores negativos

    const { error: updateError } = await supabase
      .from('categories')
      .update({ 
        article_count: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', categoryId);

    if (updateError) {
      console.error('Error updating category count:', updateError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateCategoryArticleCount:', error);
    return false;
  }
};

// Inicializar categorías por defecto (si no existen)
export const initializeDefaultCategories = async (): Promise<void> => {
  try {
    // Verificar si ya existen categorías
    const { count } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });

    if (count && count > 0) {
      return; // Ya hay categorías, no hacer nada
    }

    // Crear categorías por defecto
    const defaultCategories = getDefaultCategories();
    
    const { error } = await supabase
      .from('categories')
      .insert(defaultCategories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        article_count: 0
      })));

    if (error) {
      console.error('Error initializing default categories:', error);
    } else {
      console.log('Default categories initialized successfully');
    }
  } catch (error) {
    console.error('Error in initializeDefaultCategories:', error);
  }
};

// Categorías por defecto
const getDefaultCategories = (): Category[] => [
  { 
    id: 'llamado-divino', 
    name: 'Llamado Divino', 
    slug: 'llamado-divino', 
    description: 'Artículos sobre el descubrimiento y cumplimiento del propósito divino',
    article_count: 0 
  },
  { 
    id: 'mensaje-profetico', 
    name: 'Mensaje Profético', 
    slug: 'mensaje-profetico', 
    description: 'Revelaciones y palabras proféticas para el crecimiento espiritual',
    article_count: 0 
  },
  { 
    id: 'proposito-divino', 
    name: 'Propósito Divino', 
    slug: 'proposito-divino', 
    description: 'Enseñanzas sobre la voluntad de Dios para tu vida',
    article_count: 0 
  },
  { 
    id: 'identidad', 
    name: 'Identidad', 
    slug: 'identidad', 
    description: 'Descubrimiento de la identidad en Cristo',
    article_count: 0 
  },
  { 
    id: 'profecia', 
    name: 'Profecía', 
    slug: 'profecia', 
    description: 'Estudios proféticos y revelaciones bíblicas',
    article_count: 0 
  }
];

// Generar slug a partir de un nombre
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .trim();
};

// Limpiar localStorage de categorías (migración a Supabase)
export const clearLocalStorageCategories = (): void => {
  const keysToRemove = [
    'blog_categories',
    'blog_categories_cache', 
    'categories',
    'categories_cache',
    'blog-categories',
    'categorias',
    'categorias_cache'
  ];
  
  // Limpiar claves específicas
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`Removed localStorage key: ${key}`);
    }
  });
  
  // Buscar y eliminar cualquier clave que contenga "categor"
  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.toLowerCase().includes('categor')) {
      localStorage.removeItem(key);
      console.log(`Removed localStorage key containing 'categor': ${key}`);
    }
  });
  
  console.log('LocalStorage cleanup completed - now using Supabase for categories');
  
  // Forzar actualización de cualquier evento de categorías
  window.dispatchEvent(new CustomEvent('categoriesUpdated'));
};

// Obtener categorías para select (formato { value, label })
export const getCategoriesForSelect = (categories: Category[]): Array<{ value: string; label: string }> => {
  return categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));
};
