import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Play, BookOpen, FileText, Video, Headphones } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { subscribeToNewsletter } from '@/services/newsletterSupabase';

export function ResourcesSection() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Manejar suscripción al newsletter
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor ingresa un email válido",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await subscribeToNewsletter(newsletterEmail, 'resources-section');
      
      if (result) {
        toast({
          title: "¡Suscripción exitosa! 🙏",
          description: "Gracias por unirte a nuestra comunidad espiritual. Recibirás contenido inspirador semanalmente.",
        });
        setNewsletterEmail(''); // Limpiar el campo
      } else {
        throw new Error('Error en la suscripción');
      }
    } catch (error) {
      console.error('Error suscribiendo:', error);
      toast({
        title: "Error en la suscripción",
        description: "Hubo un problema. Por favor intenta de nuevo más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resources = [
    {
      icon: FileText,
      title: "Guía de Oración Profética",
      description: "Manual completo para desarrollar tu vida de oración y escuchar la voz de Dios con claridad.",
      type: "PDF",
      action: "Descargar gratis",
      featured: true
    },
    {
      icon: Video,
      title: "Serie: Descubriendo tu Propósito",
      description: "5 videos de enseñanza sobre cómo identificar y activar el llamado divino en tu vida.",
      type: "Video Series",
      action: "Ver ahora",
      featured: false
    },
    {
      icon: BookOpen,
      title: "Estudio Bíblico: Identidad en Cristo",
      description: "Estudio profundo de 8 semanas sobre quiénes somos en Cristo y nuestra identidad espiritual.",
      type: "Estudio",
      action: "Acceder",
      featured: false
    },
    {
      icon: Headphones,
      title: "Meditaciones Guiadas",
      description: "Audio meditaciones para la conexión espiritual y el crecimiento en intimidad con Dios.",
      type: "Audio",
      action: "Escuchar",
      featured: false
    }
  ];

  const testimonials = [
    {
      name: "Ana María García",
      role: "Líder de ministerio",
      text: "Los recursos de Maité han transformado mi vida de oración. La guía profética me ayudó a escuchar con claridad la voz de Dios.",
      location: "Madrid, España"
    },
    {
      name: "Carlos Rodríguez",
      role: "Pastor asociado",
      text: "La serie sobre propósito divino cambió mi perspectiva ministerial. Ahora camino con seguridad en mi llamado.",
      location: "Bogotá, Colombia"
    },
    {
      name: "María Elena Vásquez",
      role: "Emprendedora cristiana",
      text: "Encontré mi propósito empresarial a través de las enseñanzas de Maité. Dios me mostró cómo servir a través de mi negocio.",
      location: "Ciudad de México, México"
    }
  ];

  return (
    <section id="recursos" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
              Recursos Gratuitos
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Herramientas espirituales para acompañarte en tu crecimiento personal 
              y desarrollo de tu propósito divino.
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            {resources.map((resource, index) => (
              <Card 
                key={index} 
                className={`shadow-peaceful hover:shadow-spiritual transition-spiritual animate-slide-up ${
                  resource.featured ? 'border-primary shadow-spiritual' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {resource.featured && (
                  <Badge className="absolute -top-3 left-6 bg-gradient-spiritual">
                    Recurso destacado
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="bg-gradient-golden p-4 rounded-full w-fit mx-auto mb-4">
                    <resource.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-heading text-primary mb-2">
                    {resource.title}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit mx-auto">
                    {resource.type}
                  </Badge>
                </CardHeader>

                <CardContent className="text-center">
                  <p className="text-muted-foreground mb-6">
                    {resource.description}
                  </p>
                  <Button 
                    className={`w-full transition-spiritual ${
                      resource.featured 
                        ? 'bg-gradient-spiritual hover:shadow-spiritual' 
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    <Download className="w-4 h-4 mr-2 icon-golden-gradient" />
                    {resource.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-divine p-8 rounded-2xl shadow-peaceful mb-20">
            <div className="text-center max-w-3xl mx-auto">
              <h3 className="text-3xl font-heading font-bold mb-4 text-primary">
                Recibe contenido espiritual semanal
              </h3>
              <p className="text-muted-foreground mb-8">
                Únete a nuestra comunidad y recibe semanalmente reflexiones proféticas, 
                estudios bíblicos y recursos para tu crecimiento espiritual.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 rounded-lg border border-border bg-background disabled:opacity-50"
                />
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual px-8 disabled:opacity-50"
                >
                  {isSubmitting ? 'Suscribiendo...' : 'Suscribirme'}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                No spam. Puedes cancelar tu suscripción en cualquier momento.
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="animate-fade-in">
            <h3 className="text-3xl font-heading font-bold text-center mb-12 text-primary">
              Lo que dicen quienes han encontrado su propósito
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card 
                  key={index} 
                  className="shadow-peaceful hover:shadow-spiritual transition-spiritual animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 italic">
                      "{testimonial.text}"
                    </p>
                    <div className="border-t border-border pt-4">
                      <div className="font-semibold text-primary">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}