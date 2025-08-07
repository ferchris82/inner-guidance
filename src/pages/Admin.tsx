import React, { useEffect } from 'react';
import { BlogDashboard } from '@/components/blog/BlogDashboard';
import { Navigation } from '@/components/ui/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Admin = () => {
  // Limpiar cualquier estado corrupto al cargar la página
  useEffect(() => {
    try {
      // Limpiar estados temporales que puedan causar problemas en refresh
      const keysToClean = [
        'scrollToSection',
        'adminView', 
        'editingPost',
        'forceReset'
      ];
      
      keysToClean.forEach(key => {
        if (sessionStorage.getItem(key)) {
          sessionStorage.removeItem(key);
        }
      });
      
      // Verificar que no haya datos corruptos en localStorage
      try {
        const test = localStorage.getItem('blogPosts');
        if (test) {
          JSON.parse(test); // Si esto falla, limpiar
        }
      } catch (error) {
        console.warn('Limpiando datos corruptos de localStorage:', error);
        localStorage.removeItem('blogPosts');
      }
    } catch (error) {
      console.error('Error limpiando estado en Admin:', error);
    }
  }, []);

  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="pt-14 md:pt-16">
            <BlogDashboard />
          </div>
        </div>
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

export default Admin;

