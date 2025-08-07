import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Heart, Star, Instagram, Youtube, Facebook, MessageCircle, Twitter, Linkedin, Globe } from "lucide-react";
import heroImage from "@/assets/hero-spiritual.jpg";
import { getActiveSocialLinks, SocialLink } from "@/utils/socialStorage";

export function HeroSection() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Cargar redes sociales al montar el componente
  useEffect(() => {
    const loadSocialLinks = () => {
      const links = getActiveSocialLinks();
      setSocialLinks(links);
    };
    
    loadSocialLinks();
    
    // Escuchar cambios en las redes sociales
    const handleSocialLinksUpdate = () => {
      loadSocialLinks();
    };
    
    window.addEventListener('socialLinksUpdated', handleSocialLinksUpdate);
    
    return () => {
      window.removeEventListener('socialLinksUpdated', handleSocialLinksUpdate);
    };
  }, []);

  const scrollToNext = () => {
    const element = document.getElementById('acerca');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Función para obtener el icono correspondiente
  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: React.ComponentType<{ className?: string }> } = {
      'Instagram': Instagram,
      'Youtube': Youtube,
      'Facebook': Facebook,
      'MessageCircle': MessageCircle,
      'Twitter': Twitter,
      'Linkedin': Linkedin,
      'Globe': Globe,
    };
    return icons[iconName] || Globe;
  };

  const scrollToContact = () => {
    const element = document.getElementById('contacto');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="inicio" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-divine"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float opacity-60">
        <Star className="w-8 h-8 text-violet-brand" />
      </div>
      <div className="absolute top-40 right-20 animate-float opacity-60" style={{ animationDelay: '1s' }}>
        <Heart className="w-6 h-6 text-turquoise-brand" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float opacity-60" style={{ animationDelay: '2s' }}>
        <Star className="w-10 h-10 text-golden-brand" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 text-center z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-gradient-brand-full leading-tight">
            Mi propósito es guiarte a encontrar el tuyo
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Soy <span className="text-violet-brand font-semibold">Maité Gutiérrez</span>, 
            monitora espiritual dedicada al crecimiento personal y desarrollo espiritual. 
            Te acompaño en tu viaje hacia el descubrimiento de tu propósito divino.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={scrollToContact}
              size="lg"
              className="bg-gradient-indigo-turquoise hover:shadow-spiritual transition-spiritual px-8 py-4 text-lg font-semibold animate-glow"
            >
              Comenzar mi viaje espiritual
            </Button>
            
            <Button 
              onClick={scrollToNext}
              variant="outline"
              size="lg"
              className="border-violet-brand text-violet-brand hover:bg-violet-brand hover:text-white transition-spiritual px-8 py-4 text-lg"
            >
              Conoce mi historia
            </Button>
          </div>

          <div className={`grid gap-6 max-w-4xl mx-auto justify-items-center ${
            socialLinks.length === 1 ? 'grid-cols-1' :
            socialLinks.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
            socialLinks.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
            socialLinks.length >= 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
            'grid-cols-1 md:grid-cols-4'
          }`}>
            {socialLinks.map((link, index) => {
              const IconComponent = getIconComponent(link.icon);
              return (
                <a 
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center animate-slide-up hover:transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${(index + 1) * 0.2}s` }}
                >
                  <div className="bg-gradient-violet-golden p-4 rounded-full w-fit mx-auto mb-3 hover:shadow-spiritual transition-shadow">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-muted-foreground font-medium">{link.platform}</div>
                </a>
              );
            })}
            
            {socialLinks.length === 0 && (
              <div className="col-span-full text-center py-8">
                <div className="text-muted-foreground">
                  <Globe className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm opacity-70">Conéctate conmigo en mis redes sociales</p>
                  <p className="text-xs opacity-50 mt-1">Pronto estarán disponibles</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button 
          onClick={scrollToNext}
          className="text-muted-foreground hover:text-primary transition-spiritual"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
}