import { Mail, MapPin, Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (sectionId: string) => {
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
  };

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <h3 className="text-3xl font-heading font-bold mb-4 text-primary">
                Maité Gutiérrez
              </h3>
              <p className="text-primary-foreground/80 mb-6 text-lg leading-relaxed">
                <em>"Mi propósito es guiarte a encontrar el tuyo"</em>
              </p>
              <p className="text-primary-foreground/70 leading-relaxed">
                Monitora espiritual dedicada al crecimiento personal y desarrollo espiritual. 
                Acompañando almas en su viaje hacia el descubrimiento de su propósito divino.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading font-semibold mb-4 text-accent">
                Enlaces rápidos
              </h4>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => handleNavigation('inicio')}
                    className="text-primary-foreground/80 hover:text-accent transition-spiritual"
                  >
                    Inicio
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('acerca')}
                    className="text-primary-foreground/80 hover:text-accent transition-spiritual"
                  >
                    Acerca de mí
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('blog')}
                    className="text-primary-foreground/80 hover:text-accent transition-spiritual"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => handleNavigation('contacto')}
                    className="text-primary-foreground/80 hover:text-accent transition-spiritual"
                  >
                    Contacto
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-heading font-semibold mb-4 text-accent">
                Contacto
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 icon-golden-gradient" />
                  <span className="text-primary-foreground/80 text-sm">
                    maite.monitora@gmail.com
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 icon-golden-gradient" />
                  <span className="text-primary-foreground/80 text-sm">
                    Lun-Vie: 9AM-6PM
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 icon-golden-gradient" />
                  <span className="text-primary-foreground/80 text-sm">
                    Consultas virtuales
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="bg-primary-foreground/5 p-6 rounded-xl mb-8">
            <h4 className="font-heading font-semibold mb-3 text-accent">
              Reflexiones espirituales semanales
            </h4>
            <p className="text-primary-foreground/80 mb-4">
              Recibe contenido inspirador y guía profética directamente en tu correo.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-2 rounded-lg bg-background text-foreground border border-border"
              />
              <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-spiritual font-medium">
                Suscribirme
              </button>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-primary-foreground/20 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-primary-foreground/70 text-sm">
                 2025 Maité Gutiérrez - Monitora Espiritual.
              </div>
              <div className="flex items-center space-x-2 text-primary-foreground/70 text-sm">
                <span>Hecho por Christian F. Rojas en TopIA's</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}