import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Clock,
  User,
  Star,
  FileText
} from 'lucide-react';
import { getBlogPosts, deleteBlogPost } from '@/utils/blogSupabase';
import { BlogPost } from '@/lib/supabase';
import { getCategoryName } from '@/utils/categories';

interface BlogManagerProps {
  onEditPost?: (post: BlogPost) => void;
  onNewPost?: () => void;
}

export function BlogManager({ onEditPost, onNewPost }: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const blogPosts = await getBlogPosts();
      setPosts(blogPosts);
      setError(null);
    } catch (err) {
      console.error('Error cargando posts:', err);
      setError('Error cargando los artículos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (postId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      try {
        const success = await deleteBlogPost(postId);
        if (success) {
          // Recargar la lista de posts
          await loadPosts();
        } else {
          alert('Error al eliminar el artículo');
        }
      } catch (error) {
        console.error('Error eliminando post:', error);
        alert('Error al eliminar el artículo');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCategoryLabel = (category: string) => {
    return getCategoryName(category);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-peaceful p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando artículos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-peaceful p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadPosts} variant="outline">
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-primary mb-2">
              Gestión de Artículos
            </h1>
            <p className="text-muted-foreground">
              Administra todo tu contenido espiritual desde un solo lugar
            </p>
          </div>
          <Button onClick={onNewPost} className="bg-gradient-spiritual">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Artículo
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Artículos</p>
                  <p className="text-2xl font-bold text-primary">{posts.length}</p>
                </div>
                <FileText className="w-8 h-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Destacados</p>
                  <p className="text-2xl font-bold text-primary">
                    {posts.filter(post => post.featured).length}
                  </p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 opacity-70" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Categorías</p>
                  <p className="text-2xl font-bold text-primary">
                    {new Set(posts.map(post => post.category)).size}
                  </p>
                </div>
                <Badge className="w-8 h-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Este Mes</p>
                  <p className="text-2xl font-bold text-primary">
                    {posts.filter(post => {
                      const postDate = new Date(post.created_at);
                      const now = new Date();
                      return postDate.getMonth() === now.getMonth() && 
                             postDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de artículos */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">
                      {getCategoryLabel(post.category)}
                    </Badge>
                    {post.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.read_time}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPost?.(post)}
                      className="flex-1"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="shadow-peaceful">
            <CardContent className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No hay artículos aún</h3>
              <p className="text-muted-foreground mb-6">
                Comienza creando tu primer artículo espiritual
              </p>
              <Button onClick={onNewPost} className="bg-gradient-spiritual">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Artículo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
