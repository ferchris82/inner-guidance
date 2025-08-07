import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  Clock,
  User,
  Star,
  FileText
} from 'lucide-react';
import { getBlogPosts, deleteBlogPost, BlogPost } from '@/utils/blogStorage';

// Usar la interfaz del sistema de almacenamiento
type BlogPostType = BlogPost;

// Datos de ejemplo (se usarán solo si no hay artículos guardados)
const mockBlogPosts: BlogPostType[] = [
  {
    id: '1',
    title: '¿Qué sucede cuando renuncias a la cruz, creyendo que es aflicción?',
    excerpt: 'Hay momentos en que Dios revela el llamado, despierta el propósito, y marca asignaciones concretas sobre una persona...',
    content: '<p>Contenido del artículo...</p>',
    template: 'spiritual',
    category: 'llamado-divino',
    author: 'Maité Gutiérrez',
    featuredImage: '/images/transformation-journey.jpg',
    readTime: '8 min',
    featured: true,
    createdAt: '2025-01-15',
    updatedAt: '2025-01-15',
    customStyles: {
      primaryColor: '#2c3e50',
      secondaryColor: '#7f8c8d',
      fontFamily: 'Georgia, serif',
      spacing: 'relaxed'
    }
  },
  {
    id: '2',
    title: 'Tu provisión en tiempo de aflicción',
    excerpt: '¡Pueblo de Dios, oigan lo que el Espíritu está diciendo en este tiempo! No estamos ante una crisis cualquiera...',
    content: '<p>Contenido del artículo...</p>',
    template: 'modern',
    category: 'mensaje-profetico',
    author: 'Maité Gutiérrez',
    featuredImage: '/images/provision-afliccion.jpg',
    readTime: '12 min',
    featured: false,
    createdAt: '2025-01-10',
    updatedAt: '2025-01-12',
    customStyles: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#666',
      fontFamily: 'Inter, sans-serif',
      spacing: 'compact'
    }
  }
];

const categoryLabels = {
  'llamado-divino': 'Llamado Divino',
  'mensaje-profetico': 'Mensaje Profético',
  'proposito-divino': 'Propósito Divino',
  'identidad': 'Identidad',
  'profecia': 'Profecía'
};

const templateLabels = {
  'spiritual': 'Espiritual',
  'modern': 'Moderno',
  'classic': 'Clásico',
  'minimal': 'Minimalista'
};

export function BlogManager() {
  const [blogPosts, setBlogPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar artículos al montar el componente
  useEffect(() => {
    const loadPosts = () => {
      const savedPosts = getBlogPosts();
      if (savedPosts.length > 0) {
        setBlogPosts(savedPosts);
      } else {
        setBlogPosts(mockBlogPosts);
      }
      setLoading(false);
    };
    
    loadPosts();
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTemplate, setFilterTemplate] = useState('');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este artículo?')) {
      const success = deleteBlogPost(id);
      if (success) {
        setBlogPosts(prev => prev.filter(post => post.id !== id));
      }
    }
  };

  const handleEdit = (id: string) => {
    // Aquí se abriría el editor con el post seleccionado
    console.log('Editando post:', id);
  };

  const handleView = (id: string) => {
    // Aquí se abriría la vista previa del post
    console.log('Viendo post:', id);
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || post.category === filterCategory;
    const matchesTemplate = !filterTemplate || post.template === filterTemplate;
    const matchesFeatured = !showFeaturedOnly || post.featured;

    return matchesSearch && matchesCategory && matchesTemplate && matchesFeatured;
  });

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
                Administra y edita tus artículos espirituales
              </p>
            </div>
            <Button className="bg-gradient-spiritual hover:shadow-spiritual">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Artículo
            </Button>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <Card className="mb-6 shadow-peaceful">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar artículos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filterTemplate} onValueChange={setFilterTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las plantillas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las plantillas</SelectItem>
                  {Object.entries(templateLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured-only"
                  checked={showFeaturedOnly}
                  onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="featured-only" className="text-sm font-medium">
                  Solo destacados
                </label>
              </div>

              <div className="text-sm text-muted-foreground">
                {filteredPosts.length} de {blogPosts.length} artículos
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Artículos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[post.category as keyof typeof categoryLabels]}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {templateLabels[post.template as keyof typeof templateLabels]}
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
                          onClick={() => handleView(post.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPosts.length === 0 && (
          <Card className="shadow-peaceful">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron artículos</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterCategory || filterTemplate || showFeaturedOnly
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza creando tu primer artículo espiritual'
                }
              </p>
              <Button className="bg-gradient-spiritual hover:shadow-spiritual">
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
