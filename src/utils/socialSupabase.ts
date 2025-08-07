import { supabase, SocialLink } from '@/lib/supabase'

export const getSocialLinks = async (): Promise<SocialLink[]> => {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('is_active', true)
      .order('order_position', { ascending: true })
    
    if (error) {
      console.error('Error fetching social links:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching social links:', error)
    return []
  }
}

export const getAllSocialLinks = async (): Promise<SocialLink[]> => {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('order_position', { ascending: true })
    
    if (error) {
      console.error('Error fetching all social links:', error)
      return []
    }
    
    return data || []
  } catch (error) {
    console.error('Error fetching all social links:', error)
    return []
  }
}

export const saveSocialLink = async (link: Omit<SocialLink, 'id'>): Promise<SocialLink | null> => {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .insert([link])
      .select()
      .single()
    
    if (error) {
      console.error('Error saving social link:', error)
      return null
    }
    
    return data
  } catch (error) {
    console.error('Error saving social link:', error)
    return null
  }
}

export const updateSocialLink = async (id: string, updates: Partial<SocialLink>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('social_links')
      .update(updates)
      .eq('id', id)
    
    if (error) {
      console.error('Error updating social link:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error updating social link:', error)
    return false
  }
}

export const deleteSocialLink = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting social link:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error deleting social link:', error)
    return false
  }
}
