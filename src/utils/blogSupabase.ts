import { supabase, BlogPost } from '@/lib/supabase'

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

export const saveBlogPost = async (post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...post,
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

export const updateBlogPost = async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
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
}
