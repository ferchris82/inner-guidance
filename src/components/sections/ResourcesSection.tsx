import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AudioPlayButton } from "@/components/audio/AudioPlayButton";
import { YouTubeEmbed } from "@/components/media/YouTubeEmbed";
import { Download, Play, BookOpen, FileText, Video, Headphones, Youtube, Music, X } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { subscribeToNewsletter } from '@/services/newsletterSupabase';
import { getActiveResources } from '@/utils/resourcesSupabase';
import { ResourceItem, resourceTypeConfig } from '@/utils/resourcesConfig';

export function ResourcesSection() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalResources, setModalResources] = useState<ResourceItem[]>([]);
  const { toast } = useToast();

  // Definir categorías de recursos
  const resourceCategories = [
    {
      type: 'podcast',
      title: 'Podcasts',
      description: 'Reflexiones espirituales y enseñanzas en formato de audio',
      icon: Headphones,
      color: 'from-purple-500 to-pink-500'
    },
    {
      type: 'youtube',
      title: 'Videos YouTube',
      description: 'Contenido audiovisual inspirador y educativo',
      icon: Youtube,
      color: 'from-red-500 to-red-600'
    },
    {
      type: 'audio',
      title: 'Audios',
      description: 'Meditaciones, oraciones y contenido espiritual',
      icon: Music,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      type: 'pdf',
      title: 'Documentos PDF',
      description: 'Libros, estudios y material de lectura',
      icon: FileText,
      color: 'from-green-500 to-emerald-500'
    },
    {
      type: 'study',
      title: 'Estudios Bíblicos',
      description: 'Profundización en las Escrituras',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-500'
    },
    {
      type: 'video_series',
      title: 'Series de Video',
      description: 'Contenido estructurado en múltiples partes',
      icon: Video,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

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

  // Abrir modal con recursos filtrados por categoría
  const openCategoryModal = (categoryType: string) => {
    const filteredResources = resources.filter(resource => resource.type === categoryType);
    setModalResources(filteredResources);
    setSelectedCategory(categoryType);
  };

  // Cerrar modal
  const closeModal = () => {
    setSelectedCategory(null);
    setModalResources([]);
  };

  // Obtener información de la categoría seleccionada
  const getSelectedCategoryInfo = () => {
    return resourceCategories.find(cat => cat.type === selectedCategory);
  };

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

          {/* Resource Categories Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {resourceCategories.map((category, index) => {
              const IconComponent = category.icon;
              const categoryCount = resources.filter(r => r.type === category.type).length;
              
              return (
                <Card 
                  key={category.type}
                  className="shadow-peaceful hover:shadow-spiritual transition-spiritual animate-slide-up cursor-pointer group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => openCategoryModal(category.type)}
                >
                  <CardHeader className="text-center pb-3">
                    <div className={`bg-gradient-to-r ${category.color} p-4 rounded-full w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-heading text-primary mb-2">
                      {category.title}
                    </CardTitle>
                    {categoryCount > 0 && (
                      <Badge className="w-fit mx-auto bg-gradient-spiritual">
                        {categoryCount} recurso{categoryCount !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="text-center pt-0 pb-6">
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                      {category.description}
                    </p>
                    
                    <Button 
                      className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 transition-all text-white shadow-lg`}
                      disabled={categoryCount === 0}
                    >
                      {categoryCount > 0 ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Ver recursos
                        </>
                      ) : (
                        'Próximamente'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
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

      {/* Modal para mostrar recursos de la categoría seleccionada */}
      <Dialog open={!!selectedCategory} onOpenChange={closeModal}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden p-0 z-[9000]">
          {/* Header del Modal */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getSelectedCategoryInfo() && (() => {
                    const categoryInfo = getSelectedCategoryInfo()!;
                    const IconComponent = categoryInfo.icon;
                    return (
                      <>
                        <div className={`bg-gradient-to-r ${categoryInfo.color} p-2 rounded-lg`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <DialogTitle className="text-xl font-heading text-primary">
                            {categoryInfo.title}
                          </DialogTitle>
                          <p className="text-sm text-muted-foreground">
                            {modalResources.length} recurso{modalResources.length !== 1 ? 's' : ''} disponible{modalResources.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* Botón flotante de cerrar */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-[9010] bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg border border-gray-200 transition-all duration-200 hover:scale-110"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Contenido del Modal con scroll */}
          <div className="overflow-y-auto max-h-[70vh] p-4">
            {modalResources.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getSelectedCategoryInfo() && (() => {
                    const IconComponent = getSelectedCategoryInfo()!.icon;
                    return <IconComponent className="w-8 h-8 text-gray-400" />;
                  })()}
                </div>
                <h3 className="text-lg font-semibold mb-2">No hay recursos disponibles</h3>
                <p className="text-muted-foreground">
                  Los recursos de esta categoría se están preparando. ¡Vuelve pronto!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {modalResources.map((resource) => {
                  const isYouTubeVideo = (resource.type === 'youtube' || resource.type === 'video_series') && 
                                       (resource.url.includes('youtube.com') || resource.url.includes('youtu.be'));
                  const isAudioContent = (resource.type === 'audio' || resource.type === 'podcast') && 
                                       (resource.url.includes('supabase') || resource.url.endsWith('.mp3') || 
                                        resource.url.endsWith('.wav') || resource.url.endsWith('.m4a'));

                  return (
                    <Card 
                      key={resource.id} 
                      className={`p-3 hover:shadow-md transition-shadow`}
                    >
                      <div className="flex gap-2.5">
                        {/* Thumbnail/Icon un poco más grande */}
                        <div className="flex-shrink-0">
                          {resource.thumbnail_url ? (
                            <img 
                              src={resource.thumbnail_url} 
                              alt={resource.title}
                              className="w-12 h-9 rounded object-cover"
                            />
                          ) : (
                            <div className={`w-12 h-9 bg-gradient-to-r ${getSelectedCategoryInfo()?.color} rounded flex items-center justify-center`}>
                              {getSelectedCategoryInfo() && (() => {
                                const IconComponent = getSelectedCategoryInfo()!.icon;
                                return <IconComponent className="w-4 h-4 text-white" />;
                              })()}
                            </div>
                          )}
                        </div>

                        {/* Content un poco más espacioso */}
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between mb-1.5">
                            <div className="flex-grow">
                              <h3 className="text-sm font-semibold text-primary line-clamp-2 leading-tight">
                                {resource.title}
                              </h3>
                              {resource.featured && (
                                <Badge className="bg-gradient-spiritual text-xs mt-1">
                                  Destacado
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <p className="text-muted-foreground mb-2.5 text-xs line-clamp-2 leading-relaxed">
                            {resource.description}
                          </p>

                          {/* Reproductor específico según el tipo - compacto pero legible */}
                          {isAudioContent ? (
                            <div className="scale-85 origin-left -ml-2">
                              <AudioPlayButton
                                audioUrl={resource.url}
                                title={resource.title}
                                description={resource.description}
                                thumbnail={resource.thumbnail_url}
                                resourceId={resource.id}
                              />
                            </div>
                          ) : isYouTubeVideo ? (
                            <div className="w-full">
                              <YouTubeEmbed 
                                videoUrl={resource.url}
                                title={resource.title}
                                description={resource.description}
                                className="compact-video"
                              />
                            </div>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => window.open(resource.url, '_blank', 'noopener,noreferrer')}
                              className="h-6 text-xs px-2.5"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {resource.type === 'pdf' ? 'Descargar' : 'Ver'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}