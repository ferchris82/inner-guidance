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
import { getBlogPosts, deleteBlogPost, BlogPost } from '@/utils/blogStorage';

// Usar la interfaz del sistema de almacenamiento
type BlogPostType = BlogPost;

interface BlogManagerProps {
  onEditPost?: (post: BlogPost) => void;
  onNewPost?: () => void;
}

const categoryLabels = {
  'llamado-divino': 'Llamado Divino',
  'mensaje-profetico': 'Mensaje Profético',
  'proposito-divino': 'Propósito Divino',
  'identidad': 'Identidad',
  'profecia': 'Profecía'
};

export function BlogManager({ onEditPost, onNewPost }: BlogManagerProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar artículos al montar el componente
  useEffect(() => {
    console.log('BlogManager: Iniciando carga...');
    
    const loadPosts = async () => {
      try {
        // Simular un pequeño delay para ver el loading
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const savedPosts = getBlogPosts();
        console.log('BlogManager: Posts guardados:', savedPosts);
        
        setBlogPosts(savedPosts);
        
        setLoading(false);
        console.log('BlogManager: Carga completada');
      } catch (error) {
        console.error('BlogManager: Error cargando posts:', error);
        setBlogPosts([]);
        setLoading(false);
      }
    };
    
    loadPosts();
  }, []);

  const handleEdit = (id: string) => {
    const post = blogPosts.find(p => p.id === id);
    if (post && onEditPost) {
      onEditPost(post);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      const success = deleteBlogPost(id);
      if (success) {
        setBlogPosts(prev => prev.filter(post => post.id !== id));
      }
    }
  };

  console.log('BlogManager render - loading:', loading, 'posts count:', blogPosts.length);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-peaceful p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold text-primary mb-2">
            Cargando artículos...
          </h2>
          <p className="text-muted-foreground">Un momento por favor</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-primary mb-2">
                Gestor de Blog
              </h1>
              <p className="text-muted-foreground">
                Administra y edita tus artículos espirituales ({blogPosts.length} artículos)
              </p>
            </div>
            <Button 
              onClick={onNewPost}
              className="bg-gradient-spiritual hover:shadow-spiritual"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Artículo
            </Button>
          </div>
        </div>

        {/* Lista de Artículos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <Card key={post.id} className="shadow-peaceful hover:shadow-spiritual transition-spiritual group">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        {categoryLabels[post.category as keyof typeof categoryLabels]}
                      </Badge>
                      {post.featured && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <CardTitle className="text-lg font-heading group-hover:text-primary transition-spiritual line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(post.id)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <Card className="shadow-peaceful">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron artículos</h3>
              <p className="text-muted-foreground mb-4">
                Comienza creando tu primer artículo espiritual
              </p>
              <Button 
                onClick={onNewPost}
                className="bg-gradient-spiritual hover:shadow-spiritual"
              >
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
