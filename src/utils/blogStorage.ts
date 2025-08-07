// Sistema de almacenamiento local para artículos del blog
// Usa localStorage para persistir los datos entre sesiones

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  template: string;
  category: string;
  author: string;
  featuredImage: string;
  readTime: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  customStyles: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    spacing: string;
  };
}

const STORAGE_KEY = 'maite_blog_posts';

// Obtener todos los artículos
export const getBlogPosts = (): BlogPost[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch (error) {
    console.error('Error al cargar artículos del blog:', error);
    return [];
  }
};

// Guardar un artículo
export const saveBlogPost = (post: BlogPost): boolean => {
  try {
    const posts = getBlogPosts();
    const existingIndex = posts.findIndex(p => p.id === post.id);
    
    if (existingIndex >= 0) {
      // Actualizar artículo existente
      posts[existingIndex] = {
        ...post,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Crear nuevo artículo
      const newPost = {
        ...post,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      posts.unshift(newPost); // Agregar al inicio
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return true;
  } catch (error) {
    console.error('Error al guardar artículo:', error);
    return false;
  }
};

// Eliminar un artículo
export const deleteBlogPost = (id: string): boolean => {
  try {
    const posts = getBlogPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPosts));
    return true;
  } catch (error) {
    console.error('Error al eliminar artículo:', error);
    return false;
  }
};

// Obtener un artículo por ID
export const getBlogPostById = (id: string): BlogPost | null => {
  try {
    const posts = getBlogPosts();
    return posts.find(p => p.id === id) || null;
  } catch (error) {
    console.error('Error al obtener artículo:', error);
    return null;
  }
};

// Obtener artículos destacados
export const getFeaturedPosts = (): BlogPost[] => {
  try {
    const posts = getBlogPosts();
    return posts.filter(p => p.featured).slice(0, 3);
  } catch (error) {
    console.error('Error al obtener artículos destacados:', error);
    return [];
  }
};

// Obtener artículos por categoría
export const getPostsByCategory = (category: string): BlogPost[] => {
  try {
    const posts = getBlogPosts();
    return posts.filter(p => p.category === category);
  } catch (error) {
    console.error('Error al obtener artículos por categoría:', error);
    return [];
  }
};

// Limpiar todos los artículos (para desarrollo)
export const clearAllPosts = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error al limpiar artículos:', error);
  }
};
