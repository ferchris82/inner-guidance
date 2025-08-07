import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogEditor } from './BlogEditor';
import { BlogManager } from './BlogManager.new';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Edit3, 
  Plus,
  ArrowLeft
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost, getBlogPosts } from '@/utils/blogStorage';

type DashboardView = 'overview' | 'editor' | 'manager';

export function BlogDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [recentArticles, setRecentArticles] = useState<BlogPost[]>([]);

  // Cargar artículos recientes al montar el componente
  useEffect(() => {
    const loadRecentArticles = () => {
      const articles = getBlogPosts();
      // Ordenar por fecha de creación (más recientes primero) y tomar solo los primeros 3
      const sortedArticles = articles
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3);
      setRecentArticles(sortedArticles);
    };

    loadRecentArticles();

    // Actualizar cuando cambie la vista (por si se crearon nuevos artículos)
    if (currentView === 'overview') {
      loadRecentArticles();
    }
  }, [currentView]);

  // Escuchar cuando el botón Admin resetee el estado
  useEffect(() => {
    const checkForceReset = () => {
      const forceReset = sessionStorage.getItem('forceReset');
      if (forceReset === 'true') {
        // Resetear el dashboard
        setCurrentView('overview');
        setIsEditing(false);
        setEditingPost(null);
        // Limpiar la bandera
        sessionStorage.removeItem('forceReset');
      }
    };

    // Verificar al montar y después de cada navegación
    checkForceReset();

    // También verificar periódicamente por si acaso
    const interval = setInterval(checkForceReset, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // También verificar cuando cambie la vista actual
  useEffect(() => {
    const forceReset = sessionStorage.getItem('forceReset');
    if (forceReset === 'true' && currentView !== 'overview') {
      setCurrentView('overview');
      setIsEditing(false);
      setEditingPost(null);
      sessionStorage.removeItem('forceReset');
    }
  }, [currentView]);

  const handleNewPost = () => {
    setEditingPost(null);
    setIsEditing(true);
    setCurrentView('editor');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditing(true);
    setCurrentView('editor');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleBackToManager = () => {
    setCurrentView('manager');
    setIsEditing(false);
    setEditingPost(null);
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Función para obtener el nombre de la categoría
  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'llamado-divino': 'Llamado Divino',
      'mensaje-profetico': 'Mensaje Profético',
      'proposito-divino': 'Propósito Divino',
      'identidad': 'Identidad',
      'profecia': 'Profecía'
    };
    return categories[category] || category;
  };

  if (currentView === 'editor') {
    return (
      <div className="min-h-screen bg-gradient-peaceful">
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={editingPost ? handleBackToManager : handleBackToOverview}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {editingPost ? 'Volver al Gestor' : 'Volver al Dashboard'}
          </Button>
        </div>
        <BlogEditor editingPost={editingPost} />
      </div>
    );
  }

  if (currentView === 'manager') {
    return (
      <div className="min-h-screen bg-gradient-peaceful">
        <div className="p-4">
          <Button
            variant="ghost"
            onClick={handleBackToOverview}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
        <BlogManager onEditPost={handleEditPost} onNewPost={handleNewPost} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-primary mb-2">
            Dashboard del Blog
          </h1>
          <p className="text-muted-foreground">
            Administra tu contenido espiritual con herramientas profesionales
          </p>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="shadow-peaceful hover:shadow-spiritual transition-spiritual cursor-pointer"
              onClick={handleNewPost}
            >
              <CardContent className="p-6 text-center">
                <Plus className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nuevo Artículo</h3>
                <p className="text-sm text-muted-foreground">
                  Crea contenido espiritual con el editor profesional
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="shadow-peaceful hover:shadow-spiritual transition-spiritual cursor-pointer"
              onClick={() => setCurrentView('manager')}
            >
              <CardContent className="p-6 text-center">
                <Edit3 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Gestionar Artículos</h3>
                <p className="text-sm text-muted-foreground">
                  Edita, organiza y administra tus publicaciones
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Artículos Recientes */}
        <Card className="shadow-peaceful">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Artículos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentArticles.length > 0 ? (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 bg-gradient-peaceful rounded-lg">
                    <div>
                      <h4 className="font-medium line-clamp-1">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Publicado el {formatDate(article.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {getCategoryName(article.category)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">
                  No hay artículos recientes
                </p>
                <Button 
                  onClick={handleNewPost}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Artículo
                </Button>
              </div>
            )}
            
            {recentArticles.length > 0 && (
              <div className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('manager')}
                  className="w-full"
                >
                  Ver Todos los Artículos
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
