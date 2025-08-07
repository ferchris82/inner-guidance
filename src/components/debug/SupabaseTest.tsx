import { useEffect, useState } from 'react'
import { supabase, BlogPost } from '@/lib/supabase'
import { insertSampleData } from '@/utils/insertSampleData'

export function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState('Conectando...')
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [error, setError] = useState<string | null>(null)
  const [inserting, setInserting] = useState(false)

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('🔍 Probando conexión a Supabase...')
        console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
        console.log('Key existe:', !!import.meta.env.VITE_SUPABASE_ANON_KEY)

        // Probar conexión básica
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .limit(1)

        if (error) {
          console.error('❌ Error en Supabase:', error)
          setConnectionStatus('Error de conexión')
          setError(error.message)
        } else {
          console.log('✅ Conexión exitosa, datos:', data)
          setConnectionStatus('Conectado exitosamente')
          
          // Ahora obtener todos los posts
          const { data: allPosts, error: allError } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false })

          if (allError) {
            console.error('❌ Error obteniendo todos los posts:', allError)
            setError(allError.message)
          } else {
            console.log('📚 Posts encontrados:', allPosts?.length || 0)
            setBlogPosts(allPosts || [])
          }
        }
      } catch (err) {
        console.error('❌ Error general:', err)
        setConnectionStatus('Error general')
        setError(err instanceof Error ? err.message : 'Error desconocido')
      }
    }

    testConnection()
  }, [])

  const handleInsertSampleData = async () => {
    setInserting(true)
    try {
      const result = await insertSampleData()
      if (result.success) {
        setConnectionStatus('Datos insertados exitosamente')
        // Recargar datos
        const { data: allPosts } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false })
        setBlogPosts(allPosts || [])
      } else {
        setError('Error insertando datos: ' + (result.error || 'Error desconocido'))
      }
    } catch (err) {
      setError('Error insertando datos: ' + (err instanceof Error ? err.message : 'Error desconocido'))
    } finally {
      setInserting(false)
    }
  }

  return (
    <div className="p-8 bg-gray-100 rounded-lg m-4">
      <h2 className="text-xl font-bold mb-4">🔧 Diagnóstico Supabase</h2>
      
      <div className="space-y-2 mb-4">
        <div><strong>Estado:</strong> {connectionStatus}</div>
        <div><strong>URL:</strong> {import.meta.env.VITE_SUPABASE_URL || 'No definida'}</div>
        <div><strong>API Key:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'No configurada'}</div>
        <div><strong>Posts encontrados:</strong> {blogPosts.length}</div>
        {blogPosts.length === 0 && (
          <button
            onClick={handleInsertSampleData}
            disabled={inserting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {inserting ? 'Insertando...' : '🌱 Insertar Datos de Ejemplo'}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {blogPosts.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Posts encontrados:</h3>
          <ul className="space-y-1">
            {blogPosts.map((post, index) => (
              <li key={post.id} className="text-sm bg-white p-2 rounded">
                {index + 1}. {post.title} - {post.category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
