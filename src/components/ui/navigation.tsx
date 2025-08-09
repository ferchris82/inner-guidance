import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings, LogOut } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { isAuthenticated, logout } from "@/utils/auth";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar autenticación al montar y cuando cambie la ruta
  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };
    
    checkAuth();
    
    // Verificar periódicamente
    const interval = setInterval(checkAuth, 30000); // cada 30 segundos
    
    return () => clearInterval(interval);
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    // Si estamos en admin, navegamos primero a la página principal
    if (location.pathname === '/admin') {
      // Navegamos a la página principal y guardamos en sessionStorage la sección objetivo
      sessionStorage.setItem('scrollToSection', sectionId);
      navigate('/');
    } else {
      // Si ya estamos en la página principal, solo hacemos scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  const handleAdminNavigation = () => {
    if (location.pathname === '/admin') {
      // Si ya estamos en admin, resetear al dashboard principal
      sessionStorage.setItem('adminView', 'overview');
      sessionStorage.removeItem('editingPost');
      sessionStorage.setItem('forceReset', 'true');
      // Navegar a la misma ruta para forzar re-renderizado
      navigate('/admin', { replace: true });
      window.location.hash = '#dashboard'; // Truco para forzar actualización
      setTimeout(() => {
        window.location.hash = '';
      }, 100);
    } else {
      // Si no estamos en admin, navegar normalmente
      sessionStorage.removeItem('adminView');
      sessionStorage.removeItem('editingPost');
      sessionStorage.setItem('forceReset', 'true');
      navigate('/admin');
    }
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsAuth(false);
    // Mostrar mensaje de confirmación
    console.log('🚪 Sesión cerrada correctamente');
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-accent/20 rounded-xl shadow-sm flex items-center justify-center border border-accent/30">
              <img 
                src="/favicon.svg" 
                alt="Guía Interior - Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <h1 className="text-2xl font-heading font-bold text-primary">
              Guía Interior
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('inicio')}
              className="text-foreground hover:text-primary transition-spiritual"
            >
              Inicio
            </button>
            <button 
              onClick={() => scrollToSection('acerca')}
              className="text-foreground hover:text-primary transition-spiritual"
            >
              Acerca de mí
            </button>
            <button 
              onClick={() => scrollToSection('blog')}
              className="text-foreground hover:text-primary transition-spiritual"
            >
              Blog
            </button>
            <Button 
              onClick={() => scrollToSection('contacto')}
              className="bg-gradient-aqua hover:shadow-spiritual transition-spiritual"
            >
              Contacto
            </Button>
            {/* Botones de Admin/Logout */}
            {isAuth ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAdminNavigation}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleAdminNavigation}
              >
                <Settings className="w-4 h-4 mr-1" />
                Admin
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border-t border-border">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="block px-3 py-2 text-foreground hover:text-primary transition-spiritual w-full text-left"
              >
                Inicio
              </button>
              <button 
                onClick={() => scrollToSection('acerca')}
                className="block px-3 py-2 text-foreground hover:text-primary transition-spiritual w-full text-left"
              >
                Acerca de mí
              </button>
              <button 
                onClick={() => scrollToSection('blog')}
                className="block px-3 py-2 text-foreground hover:text-primary transition-spiritual w-full text-left"
              >
                Blog
              </button>
              <Button 
                onClick={() => scrollToSection('contacto')}
                className="w-full mt-2 bg-gradient-golden hover:shadow-spiritual transition-spiritual"
              >
                Contacto
              </Button>
              {/* Botones de Admin/Logout para móvil */}
              {isAuth ? (
                <div className="flex flex-col gap-2 mt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={handleAdminNavigation}
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Admin
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-red-600 border-red-600 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-1" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={handleAdminNavigation}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Admin
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}