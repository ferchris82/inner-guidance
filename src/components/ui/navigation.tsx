import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Settings } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-heading font-bold text-gradient-spiritual">
              Maité Gutiérrez
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
            <button 
              onClick={() => scrollToSection('recursos')}
              className="text-foreground hover:text-primary transition-spiritual"
            >
              Recursos
            </button>
            <Button 
              onClick={() => scrollToSection('contacto')}
              className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual"
            >
              Contacto
            </Button>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-1" />
                Admin
              </Button>
            </Link>
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
              <button 
                onClick={() => scrollToSection('recursos')}
                className="block px-3 py-2 text-foreground hover:text-primary transition-spiritual w-full text-left"
              >
                Recursos
              </button>
              <Button 
                onClick={() => scrollToSection('contacto')}
                className="w-full mt-2 bg-gradient-spiritual hover:shadow-spiritual transition-spiritual"
              >
                Contacto
              </Button>
              <Link to="/admin">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <Settings className="w-4 h-4 mr-1" />
                  Admin
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}