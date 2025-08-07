import { Button } from "@/components/ui/button";
import { ArrowDown, Heart, Star } from "lucide-react";
import heroImage from "@/assets/hero-spiritual.jpg";

export function HeroSection() {
  const scrollToNext = () => {
    const element = document.getElementById('acerca');
    element?.scrollIntoView({ behavior: 'smooth' });
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
        <Star className="w-8 h-8 text-accent" />
      </div>
      <div className="absolute top-40 right-20 animate-float opacity-60" style={{ animationDelay: '1s' }}>
        <Heart className="w-6 h-6 text-primary" />
      </div>
      <div className="absolute bottom-40 left-20 animate-float opacity-60" style={{ animationDelay: '2s' }}>
        <Star className="w-10 h-10 text-accent" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 text-center z-10">
        <div className="max-w-4xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 text-gradient-spiritual leading-tight">
            Mi propósito es guiarte a encontrar el tuyo
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Soy <span className="text-primary font-semibold">Maité Gutiérrez</span>, 
            monitora espiritual dedicada al crecimiento personal y desarrollo espiritual. 
            Te acompaño en tu viaje hacia el descubrimiento de tu propósito divino.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              onClick={scrollToContact}
              size="lg"
              className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual px-8 py-4 text-lg font-semibold animate-glow"
            >
              Comenzar mi viaje espiritual
            </Button>
            
            <Button 
              onClick={scrollToNext}
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-spiritual px-8 py-4 text-lg"
            >
              Conoce mi historia
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-primary mb-2">5+</div>
              <div className="text-muted-foreground">Años de experiencia</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Personas guiadas</div>
            </div>
            <div className="text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-muted-foreground">Artículos espirituales</div>
            </div>
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