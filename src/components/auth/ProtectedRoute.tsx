import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { isAuthenticated, renewSession } from '@/utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar autenticación al montar el componente
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      if (authenticated) {
        // Renovar la sesión si está autenticado
        renewSession();
      }
    };

    checkAuth();

    // Verificar periódicamente la autenticación (cada 5 minutos)
    const interval = setInterval(checkAuth, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuth(true);
    // La navegación ya no es necesaria aquí porque el componente se actualiza
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Mientras se verifica la autenticación, mostrar loading
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
