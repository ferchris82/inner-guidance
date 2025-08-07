import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, BookOpen, Users, MessageCircle, Calendar, Star } from "lucide-react";

export function ServicesSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contacto');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const services = [
    {
      icon: MessageCircle,
      title: "Consulta Espiritual Personal",
      description: "Sesiones individuales de 60 minutos para recibir guía profética y dirección espiritual personalizada.",
      features: ["Revelación profética", "Dirección para decisiones", "Sanidad emocional", "Activación del propósito"],
      price: "Consultar",
      featured: true
    },
    {
      icon: Users,
      title: "Mentoría Espiritual",
      description: "Acompañamiento mensual para profundizar en tu crecimiento espiritual y liderazgo del Reino.",
      features: ["4 sesiones mensuales", "Material de estudio", "Seguimiento personalizado", "Grupo de apoyo"],
      price: "Consultar",
      featured: false
    },
    {
      icon: Video,
      title: "Conferencias y Talleres",
      description: "Eventos presenciales y virtuales sobre temas de crecimiento espiritual y propósito divino.",
      features: ["Temas especializados", "Ministerio profético", "Revelación bíblica", "Activación de dones"],
      price: "Consultar",
      featured: false
    },
    {
      icon: BookOpen,
      title: "Recursos Escritos",
      description: "Artículos, estudios bíblicos y material devocional para tu crecimiento espiritual diario.",
      features: ["Artículos proféticos", "Estudios bíblicos", "Devocionales", "Guías de oración"],
      price: "Gratuito",
      featured: false
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-background">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gradient-spiritual">
              Servicios Espirituales
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Acompañamiento personalizado en tu viaje espiritual hacia el descubrimiento 
              y activación de tu propósito divino.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className={`relative shadow-peaceful hover:shadow-spiritual transition-spiritual animate-slide-up ${
                  service.featured ? 'border-primary shadow-spiritual' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {service.featured && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-spiritual">
                    Más popular
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="bg-gradient-spiritual p-4 rounded-full w-fit mx-auto mb-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-heading text-primary mb-2">
                    {service.title}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">{service.price}</span>
                      {service.price !== "Gratuito" && (
                        <Badge variant="outline">Inversión</Badge>
                      )}
                    </div>
                    
                    <Button 
                      onClick={scrollToContact}
                      className={`w-full transition-spiritual ${
                        service.featured 
                          ? 'bg-gradient-spiritual hover:shadow-spiritual' 
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      {service.price === "Gratuito" ? "Acceder ahora" : "Solicitar información"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-divine p-8 rounded-2xl shadow-peaceful">
              <h3 className="text-2xl font-heading font-bold mb-4 text-primary">
                ¿No estás seguro qué servicio necesitas?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Conversemos sobre tu situación específica y encontremos juntos 
                el camino que Dios tiene preparado para ti.
              </p>
              <Button 
                onClick={scrollToContact}
                size="lg"
                className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Agenda una conversación gratuita
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}