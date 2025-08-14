import { supabase, BlogPost } from '@/lib/supabase'

// Obtener todos los artículos (incluye borradores)
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching blog posts:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Obtener solo los artículos publicados (no borradores)
export const getPublishedBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_draft', false)
      .order('created_at', { ascending: false })
    if (error) {
      console.error('Error fetching published blog posts:', error)
      return []
    }
    return data || []
  } catch (error) {
    console.error('Error fetching published blog posts:', error)
    return []
  }
}

// Guardar un nuevo artículo como borrador o publicado
export const saveBlogPost = async (
  post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>,
  isDraft: boolean = true
): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...post,
        is_draft: isDraft,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()
    if (error) {
      console.error('Error saving blog post:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error saving blog post:', error)
    return null
  }
}

// Actualizar un artículo existente (borrador o publicado)
export const updateBlogPost = async (
  id: string,
  updates: Partial<BlogPost>,
  isDraft?: boolean
): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
        ...(isDraft !== undefined ? { is_draft: isDraft } : {}),
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    if (error) {
      console.error('Error updating blog post:', error)
      return null
    }
    return data
  } catch (error) {
    console.error('Error updating blog post:', error)
    return null
  }
}

// Eliminar un artículo por id
export const deleteBlogPost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)
    if (error) {
      console.error('Error deleting blog post:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return false
  }
};