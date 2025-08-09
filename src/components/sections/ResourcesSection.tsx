import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Play, BookOpen, FileText, Video, Headphones, Youtube, Music } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { subscribeToNewsletter } from '@/services/newsletterSupabase';
import { getActiveResources } from '@/utils/resourcesSupabase';
import { ResourceItem, resourceTypeConfig } from '@/utils/resourcesConfig';

export function ResourcesSection() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Cargar recursos dinámicos desde Supabase
  useEffect(() => {
    const loadResources = async () => {
      try {
        setIsLoading(true);
        const data = await getActiveResources();
        setResources(data);
      } catch (error) {
        console.error('Error cargando recursos:', error);
        // En caso de error, usar recursos por defecto
        setResources([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadResources();
  }, []);

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

  // Obtener ícono según el tipo de recurso
  const getResourceIcon = (type: string) => {
    const iconMap = {
      FileText, Video, Headphones, BookOpen, Youtube, Music
    };
    
    const config = resourceTypeConfig[type as keyof typeof resourceTypeConfig];
    if (!config) return FileText;
    
    return iconMap[config.icon as keyof typeof iconMap] || FileText;
  };

  // Obtener acción según el tipo de recurso
  const getResourceAction = (type: string, url: string) => {
    switch (type) {
      case 'podcast':
        return url.includes('spotify') ? 'Escuchar en Spotify' : 'Escuchar';
      case 'youtube':
      case 'video_series':
        return 'Ver video';
      case 'pdf':
      case 'study':
        return 'Descargar';
      case 'audio':
        return 'Escuchar';
      default:
        return 'Acceder';
    }
  };

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
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 mb-20">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="shadow-peaceful animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))
            ) : resources.length === 0 ? (
              // No resources message
              <div className="col-span-full text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay recursos disponibles</h3>
                <p className="text-muted-foreground">
                  Los recursos se están preparando. Vuelve pronto para descubrir contenido espiritual inspirador.
                </p>
              </div>
            ) : (
              resources.map((resource, index) => {
                const IconComponent = getResourceIcon(resource.type);
                const action = getResourceAction(resource.type, resource.url);
                const config = resourceTypeConfig[resource.type];
                
                return (
                  <Card 
                    key={resource.id} 
                    className={`shadow-peaceful hover:shadow-spiritual transition-spiritual animate-slide-up relative ${
                      resource.featured ? 'border-primary shadow-spiritual' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {resource.featured && (
                      <Badge className="absolute -top-2 left-3 bg-gradient-spiritual text-xs px-2 py-1">
                        Destacado
                      </Badge>
                    )}
                    
                    <CardHeader className="text-center pb-3 pt-4">
                      {/* Thumbnail or Icon */}
                      <div className="mx-auto mb-3">
                        {resource.thumbnail_url ? (
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100 shadow-sm mx-auto relative">
                            <img 
                              src={resource.thumbnail_url} 
                              alt={resource.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            {/* Hidden fallback icon, shown if image fails */}
                            <div 
                              className="fallback-icon absolute inset-0 bg-gradient-aqua rounded-lg flex items-center justify-center"
                              style={{ display: 'none' }}
                            >
                              <IconComponent className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gradient-aqua p-2 rounded-full w-fit mx-auto">
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-sm font-heading text-primary mb-1 line-clamp-2 leading-tight">
                        {resource.title}
                      </CardTitle>
                      <Badge variant="outline" className="w-fit mx-auto text-xs px-2 py-1">
                        {config?.label || resource.type}
                      </Badge>
                    </CardHeader>

                    <CardContent className="text-center pt-0 pb-4">
                      <p className="text-muted-foreground mb-4 text-xs line-clamp-2 leading-relaxed">
                        {resource.description}
                      </p>
                      <Button 
                        size="sm"
                        className={`w-full transition-spiritual text-xs ${
                          resource.featured 
                            ? 'bg-gradient-spiritual hover:shadow-spiritual' 
                            : 'bg-primary hover:bg-primary/90'
                        }`}
                        onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                      >
                        <Download className="w-3 h-3 mr-1 icon-aqua-gradient" />
                        {action}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
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
        </div>
      </div>
    </section>
  );
}