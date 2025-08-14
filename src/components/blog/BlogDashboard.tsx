import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogEditor } from './BlogEditor';
import { BlogManager } from './BlogManager';
import { CategoryManager } from './CategoryManager';
import { SocialManager } from './SocialManager';
import { ContactMessagesManager } from '@/components/admin/ContactMessagesManager';
import { NewsletterManager } from '@/components/admin/NewsletterManager';
import { ResourcesManager } from '@/components/admin/ResourcesManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Edit3, 
  Plus,
  ArrowLeft,
  Globe,
  MessageSquare,
  Mail,
  Tag,
  Video,
  Headphones
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/lib/supabase';
import { getBlogPosts } from '@/utils/blogSupabase';

type DashboardView = 'overview' | 'editor' | 'manager' | 'categories' | 'social' | 'contacts' | 'newsletter' | 'resources';

export function BlogDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [recentArticles, setRecentArticles] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Manejar navegación del admin y reset
  useEffect(() => {
    // Verificar si hay una vista específica guardada
    const savedView = sessionStorage.getItem('adminView');
    const forceReset = sessionStorage.getItem('forceReset');
    
    if (forceReset === 'true') {
      // Resetear al dashboard principal
      setCurrentView('overview');
      setIsEditing(false);
      setEditingPost(null);
      sessionStorage.removeItem('forceReset');
    } else if (savedView && ['overview', 'editor', 'manager', 'categories', 'social', 'contacts', 'newsletter', 'resources'].includes(savedView)) {
      setCurrentView(savedView as DashboardView);
    }
  }, []);

  // Función helper para cambiar vista y guardar en sessionStorage
  const changeView = (view: DashboardView) => {
    setCurrentView(view);
    sessionStorage.setItem('adminView', view);
  };

  // Cargar artículos recientes al montar el componente
  useEffect(() => {
    const loadRecentArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const articles = await getBlogPosts();
        // Filtrar solo los artículos publicados
        const publishedArticles = articles.filter(a => !a.is_draft);
        // Ordenar por fecha de creación (más recientes primero) y tomar solo los primeros 3
        const sortedArticles = publishedArticles
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
    changeView('editor');
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditing(true);
    changeView('editor');
  };

  const handleBackToOverview = () => {
    changeView('overview');
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleBackToManager = () => {
    changeView('manager');
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleSocialManager = () => {
    changeView('social');
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleContactsManager = () => {
    changeView('contacts');
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleNewsletterManager = () => {
    changeView('newsletter');
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleResourcesManager = () => {
    changeView('resources');
    setIsEditing(false);
    setEditingPost(null);
  };

  const handleCategoriesManager = () => {
    changeView('categories');
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

  if (currentView === 'categories') {
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
          <CategoryManager />
        </div>
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

  if (currentView === 'contacts') {
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
          <ContactMessagesManager />
        </div>
      </div>
    );
  }

  if (currentView === 'newsletter') {
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
          <NewsletterManager />
        </div>
      </div>
    );
  }

  if (currentView === 'resources') {
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
          <ResourcesManager />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="shadow-peaceful hover:shadow-spiritual transition-spiritual cursor-pointer"
              onClick={handleNewPost}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <Plus className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">Nuevo Artículo</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
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
              <CardContent className="p-4 sm:p-6 text-center">
                <Edit3 className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">Gestionar Artículos</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
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
              onClick={handleCategoriesManager}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <Tag className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">Categorías</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Organiza tu contenido por temas espirituales
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
              <CardContent className="p-4 sm:p-6 text-center">
                <Globe className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">Redes Sociales</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Configura los enlaces a tus redes sociales
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
              onClick={handleContactsManager}
            >
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Mensajes de Contacto</h3>
                <p className="text-sm text-muted-foreground">
                  Gestiona los mensajes recibidos del formulario
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
              onClick={handleNewsletterManager}
            >
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Subscripciones</h3>
                <p className="text-sm text-muted-foreground">
                  Administra los suscriptores del newsletter
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
              onClick={handleResourcesManager}
            >
              <CardContent className="p-4 sm:p-6 text-center">
                <Video className="w-8 h-8 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium mb-2">Recursos</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Gestiona podcasts, videos de YouTube y recursos
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Artículos Recientes */}
        <Card className="shadow-peaceful">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              Artículos Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            {isLoading ? (
              <div className="text-center py-6 sm:py-8">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3 sm:mb-4"></div>
                <p className="text-sm text-muted-foreground">Cargando artículos...</p>
              </div>
            ) : recentArticles.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 sm:p-4 bg-gradient-peaceful rounded-lg">
                    <div className="flex-1 min-w-0 pr-3">
                      <h4 className="font-medium line-clamp-1 text-sm sm:text-base">{article.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Publicado el {formatDate(article.created_at)}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs flex-shrink-0">
                      {getCategoryName(article.category)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-3 sm:mb-4 opacity-50" />
                <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4">
                  No hay artículos recientes
                </p>
                <Button 
                  onClick={handleNewPost}
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Crear Primer Artículo
                </Button>
              </div>
            )}
            
            {recentArticles.length > 0 && (
              <div className="mt-4 sm:mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentView('manager')}
                  className="w-full text-xs sm:text-sm"
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



