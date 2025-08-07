import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogEditor } from './BlogEditor';
import { BlogManager } from './BlogManager';
import { SocialManager } from './SocialManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Edit3, 
  Plus,
  ArrowLeft,
  Globe
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/supabase';
import { getBlogPosts } from '@/utils/blogSupabase';

type DashboardView = 'overview' | 'editor' | 'manager' | 'social';

export function BlogDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [recentArticles, setRecentArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar artículos recientes al montar el componente
  useEffect(() => {
    const loadRecentArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const articles = await getBlogPosts();
        // Ordenar por fecha de creación (más recientes primero) y tomar solo los primeros 3
        const sortedArticles = articles
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
        setRecentArticles(sortedArticles);
      } catch (error) {
        console.error('Error cargando artículos:', error);
        setError('Error cargando los artículos. Intenta refrescar la página.');
        setRecentArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecentArticles();

    // Actualizar cuando cambie la vista (por si se crearon nuevos artículos)
    if (currentView === 'overview') {
      // Usar setTimeout para evitar problemas de race condition en refresh
      const timer = setTimeout(() => {
        loadRecentArticles();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [currentView]);

  // Escuchar cuando el botón Admin resetee el estado
  useEffect(() => {
    const checkForceReset = () => {
      try {
        const forceReset = sessionStorage.getItem('forceReset');
        if (forceReset === 'true') {
          // Resetear el dashboard
          setCurrentView('overview');
          setIsEditing(false);
          setEditingPost(null);
          setError(null);
          // Limpiar la bandera
          sessionStorage.removeItem('forceReset');
        }
      } catch (error) {
        console.error('Error en checkForceReset:', error);
        // En caso de error, resetear todo a estado seguro
        setCurrentView('overview');
        setIsEditing(false);
        setEditingPost(null);
        setError(null);
      }
    };

    // Verificar al montar y después de cada navegación
    checkForceReset();

    // También verificar periódicamente por si acaso, pero con menos frecuencia
    const interval = setInterval(checkForceReset, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // También verificar cuando cambie la vista actual
  useEffect(() => {
    try {
      const forceReset = sessionStorage.getItem('forceReset');
      if (forceReset === 'true' && currentView !== 'overview') {
        setCurrentView('overview');
        setIsEditing(false);
        setEditingPost(null);
        setError(null);
        sessionStorage.removeItem('forceReset');
      }
    } catch (error) {
      console.error('Error verificando forceReset:', error);
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

  const handleSocialManager = () => {
    setCurrentView('social');
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

  if (currentView === 'social') {
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
        <div className="max-w-6xl mx-auto p-4">
          <SocialManager />
        </div>
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
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
              >
                Refrescar página
              </button>
            </div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="shadow-peaceful hover:shadow-spiritual transition-spiritual cursor-pointer"
              onClick={handleSocialManager}
            >
              <CardContent className="p-6 text-center">
                <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Redes Sociales</h3>
                <p className="text-sm text-muted-foreground">
                  Configura los enlaces a tus redes sociales
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
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Cargando artículos...</p>
              </div>
            ) : recentArticles.length > 0 ? (
              <div className="space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-4 bg-gradient-peaceful rounded-lg">
                    <div>
                      <h4 className="font-medium line-clamp-1">{article.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Publicado el {formatDate(article.created_at)}
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

