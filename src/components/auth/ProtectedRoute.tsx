import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { isAuthenticated, renewSession, initializeAutoLogout } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Verificar autenticación inmediatamente al inicializar con debug
  const [isAuth, setIsAuth] = useState<boolean | null>(() => {
    try {
      const authenticated = isAuthenticated();
      console.log('🔐 Estado inicial de autenticación:', authenticated);
      console.log('🔐 localStorage auth:', localStorage.getItem('inner_guidance_auth'));
      return authenticated;
    } catch (error) {
      console.error('🔐 Error verificando auth inicial:', error);
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cleanupAutoLogout: (() => void) | null = null;
    
    // Verificar autenticación al montar el componente
    const checkAuth = () => {
      try {
        const authenticated = isAuthenticated();
        console.log('🔐 Verificación periódica auth:', authenticated);
        setIsAuth(authenticated);
        setError(null);
        
        if (authenticated) {
          // Renovar la sesión si está autenticado
          renewSession();
          
          // Inicializar logout automático si aún no está inicializado
          if (!cleanupAutoLogout) {
            cleanupAutoLogout = initializeAutoLogout();
          }
        }
      } catch (error) {
        console.error('🔐 Error verificando autenticación:', error);
        setError('Error verificando acceso. Intenta refrescar la página.');
        setIsAuth(false);
      }
    };

    checkAuth();

    // Verificar periódicamente la autenticación (cada 2 minutos)
    const interval = setInterval(checkAuth, 2 * 60 * 1000);

    return () => {
      clearInterval(interval);
      // Limpiar el logout automático si existe
      if (cleanupAutoLogout) {
        cleanupAutoLogout();
      }
    };
  }, []);

  const handleLoginSuccess = () => {
    setIsAuth(true);
    // La navegación ya no es necesaria aquí porque el componente se actualiza
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Mientras se verifica la autenticación, mostrar loading solo si realmente es necesario
  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar el formulario de login
  if (!isAuth) {
    return (
      <LoginForm 
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
}
