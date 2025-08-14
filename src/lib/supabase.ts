import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan las variables de entorno de Supabase:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Configurada' : '❌ Faltante');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Configurada' : '❌ Faltante');
}

console.log('🔧 Configurando cliente de Supabase...');
console.log('🌐 URL:', supabaseUrl);
console.log('🔑 Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'No configurada');

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type BlogPost = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  author: string
  featured_image?: string
  read_time: string
  featured: boolean
  is_draft: boolean
  created_at: string
  updated_at: string
}

export type SocialLink = {
  id: string
  platform: string
  url: string
  icon: string
  is_active: boolean
  order_position: number
}
