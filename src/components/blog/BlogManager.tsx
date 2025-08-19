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
import { getCategoryName, getCategories, Category } from '@/utils/categories';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';

interface BlogManagerProps {
  onEditPost?: (post: BlogPost) => void;
  onNewPost?: () => void;
}

export function BlogManager({ onEditPost, onNewPost }: BlogManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const [blogPosts, categoriesData] = await Promise.all([
        getBlogPosts(),
        getCategories()
      ]);
      setPosts(blogPosts);
      setCategories(categoriesData);
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
    const post = posts.find(p => p.id === postId) || null;
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;
    try {
      const success = await deleteBlogPost(postToDelete.id);
      if (success) {
        await loadPosts();
        setDeleteDialogOpen(false);
        setPostToDelete(null);
      } else {
        alert('Error al eliminar el artículo');
      }
    } catch (error) {
      console.error('Error eliminando post:', error);
      alert('Error al eliminar el artículo');
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
    return getCategoryName(category, categories);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-peaceful p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-primary mx-auto mb-3 sm:mb-4"></div>
            <p className="text-sm sm:text-base text-muted-foreground">Cargando artículos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-peaceful p-3 sm:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
            <Button onClick={loadPosts} variant="outline" size="sm">
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-heading font-bold text-primary mb-1 sm:mb-2">
              Gestión de Artículos
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Administra todo tu contenido espiritual desde un solo lugar
            </p>
          </div>
          <Button onClick={onNewPost} className="bg-gradient-spiritual w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Artículo
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="shadow-peaceful">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Artículos</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{posts.length}</p>
                </div>
                <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-peaceful">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Destacados</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">
                    {posts.filter(post => post.featured).length}
                  </p>
                </div>
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 opacity-70" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-peaceful">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Categorías</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">
                    {new Set(posts.map(post => post.category)).size}
                  </p>
                </div>
                <Badge className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-peaceful">
            <CardContent className="p-3 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Este Mes</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">
                    {posts.filter(post => {
                      const postDate = new Date(post.created_at);
                      const now = new Date();
                      return postDate.getMonth() === now.getMonth() && 
                             postDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-primary opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de artículos */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(post.category)}
                    </Badge>
                    <div className="flex gap-1 items-center">
                      {post.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                      <Badge
                        className={`text-xs ${post.is_draft ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-green-100 text-green-800 border-green-300'}`}
                        variant="outline"
                      >
                        {post.is_draft ? 'Borrador' : 'Publicado'}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="line-clamp-2 text-base sm:text-lg">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-muted-foreground mb-3 sm:mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className="truncate">{formatDate(post.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.read_time}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{post.author}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditPost?.(post)}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      <span className="hidden sm:inline">Editar</span>
                      <span className="sm:hidden">Edit</span>
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
            <CardContent className="text-center py-8 sm:py-12 px-4">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
              <h3 className="text-lg sm:text-xl font-medium mb-2">No hay artículos aún</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Comienza creando tu primer artículo espiritual
              </p>
              <Button onClick={onNewPost} className="bg-gradient-spiritual w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Artículo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Dialog de confirmación para eliminar */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Eliminar artículo?</DialogTitle>
            </DialogHeader>
            <div className="mb-4">
              ¿Estás seguro de que quieres eliminar el artículo <b>{postToDelete?.title || 'Sin título'}</b>?
            </div>
            <div className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button variant="destructive" onClick={confirmDelete}>Eliminar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
