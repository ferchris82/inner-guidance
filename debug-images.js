// Script temporal para debuggear URLs de imágenes en producción
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qlsqvmebynfttkbmhqgk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsc3F2bWVieW5mdHRrYm1ocWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY1MzEzNzEsImV4cCI6MjA1MjEwNzM3MX0.kJPDDVBhJACwTBDWv-QPYXqKmhcMhYKGR5Gq6HTGaJ0'

const supabase = createClient(supabaseUrl, supabaseKey)

async function debugImages() {
  console.log('🔍 Debugging image URLs...')
  
  // Obtener artículos con imágenes
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('id, title, featured_image')
    .not('featured_image', 'is', null)
    .neq('featured_image', '')
  
  if (error) {
    console.error('❌ Error fetching posts:', error)
    return
  }
  
  console.log(`📄 Found ${posts.length} posts with images:`)
  
  posts.forEach((post, index) => {
    console.log(`\n${index + 1}. "${post.title}"`)
    console.log(`   📷 Image URL: ${post.featured_image}`)
    
    // Verificar si la URL es válida
    try {
      const url = new URL(post.featured_image)
      console.log(`   ✅ URL is valid`)
      console.log(`   🌐 Domain: ${url.hostname}`)
      console.log(`   📁 Path: ${url.pathname}`)
    } catch (e) {
      console.log(`   ❌ Invalid URL format`)
    }
  })
  
  // Test storage access
  console.log('\n🔧 Testing storage access...')
  
  try {
    const { data: files, error: listError } = await supabase.storage
      .from('images')
      .list()
      
    if (listError) {
      console.error('❌ Error listing files:', listError)
    } else {
      console.log(`📁 Found ${files.length} files in storage`)
      
      if (files.length > 0) {
        const testFile = files[0]
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(testFile.name)
          
        console.log(`🔗 Sample public URL: ${publicUrl}`)
      }
    }
  } catch (e) {
    console.error('❌ Storage test failed:', e)
  }
}

debugImages()
