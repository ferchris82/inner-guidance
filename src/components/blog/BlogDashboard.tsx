import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogEditor } from './BlogEditor';
import { BlogManager } from './BlogManager';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Edit3, 
  BarChart3, 
  Settings,
  Plus,
  ArrowLeft,
  Home
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type DashboardView = 'overview' | 'editor' | 'manager' | 'stats';

export function BlogDashboard() {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isEditing, setIsEditing] = useState(false);

  const handleNewPost = () => {
    setIsEditing(true);
    setCurrentView('editor');
  };

  const handleBackToOverview = () => {
    setCurrentView('overview');
    setIsEditing(false);
  };

  const stats = {
    totalPosts: 12,
    publishedPosts: 8,
    draftPosts: 4,
    featuredPosts: 3,
    totalViews: 15420,
    totalLikes: 892
  };

  if (currentView === 'editor') {
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
        <BlogEditor />
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
        <BlogManager />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              onClick={() => setCurrentView('stats')}
            >
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Estadísticas</h3>
                <p className="text-sm text-muted-foreground">
                  Analiza el rendimiento de tu contenido
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual cursor-pointer">
              <CardContent className="p-6 text-center">
                <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Configuración</h3>
                <p className="text-sm text-muted-foreground">
                  Personaliza tu blog y plantillas
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Artículos</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalPosts}</p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Publicados</p>
                  <p className="text-3xl font-bold text-green-600">{stats.publishedPosts}</p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Borradores</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.draftPosts}</p>
                </div>
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-orange-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Destacados</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.featuredPosts}</p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Visitas</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-peaceful">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Me Gusta</p>
                  <p className="text-3xl font-bold text-red-600">{stats.totalLikes.toLocaleString()}</p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
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
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-peaceful rounded-lg">
                <div>
                  <h4 className="font-medium">¿Qué sucede cuando renuncias a la cruz, creyendo que es aflicción?</h4>
                  <p className="text-sm text-muted-foreground">Publicado el 15 de Enero, 2025</p>
                </div>
                <Badge variant="outline">Destacado</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-peaceful rounded-lg">
                <div>
                  <h4 className="font-medium">Tu provisión en tiempo de aflicción</h4>
                  <p className="text-sm text-muted-foreground">Publicado el 10 de Enero, 2025</p>
                </div>
                <Badge variant="outline">Mensaje Profético</Badge>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('manager')}
                className="w-full"
              >
                Ver Todos los Artículos
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
