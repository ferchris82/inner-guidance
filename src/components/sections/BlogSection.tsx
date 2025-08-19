import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, BookOpen, X, Share2, ArrowLeft, Clock, User, Plus, Sparkles } from "lucide-react";
import { getPublishedBlogPosts } from "@/utils/blogSupabase";
import { BlogPost } from "@/lib/supabase";
import { isAuthenticated } from "@/utils/auth";
import { getCategoryName, getCategories, Category } from "@/utils/categories";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
// Import required modules
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules';

// 🔧 Utility function to decode hex-encoded URLs
const decodeHexUrl = (url: string): string => {
  if (!url) return url;
  
  // Check if URL is hex-encoded (starts with \x)
  if (url.includes('\\x')) {
    try {
      let result = '';
      const cleanHex = url.replace(/\\x/g, '');
      for (let i = 0; i < cleanHex.length; i += 2) {
        result += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
      }
      console.log('🔧 Decoded hex URL:', result);
      return result;
    } catch (error) {
      console.error('❌ Error decoding hex URL:', error);
      return url;
    }
  }
  
  return url;
};

export function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar artículos al montar el componente
  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const [savedArticles, categoriesData] = await Promise.all([
          getPublishedBlogPosts(),
          getCategories()
        ]);
        
        // 🔍 DEBUG: Log image URLs
        console.log('🔍 DEBUG - Articles loaded:', savedArticles.length);
        savedArticles.forEach((article, index) => {
          if (article.featured_image) {
            console.log(`📷 Article ${index + 1}: "${article.title}"`);
            console.log(`   Image URL: ${article.featured_image}`);
            console.log(`   URL valid: ${article.featured_image.startsWith('http')}`);
          }
        });
        
        setArticles(savedArticles);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadArticles();
    
    // Escuchar cuando se vuelve visible la página
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        const [savedArticles, categoriesData] = await Promise.all([
          getPublishedBlogPosts(),
          getCategories()
        ]);
        
        // 🔍 DEBUG: Log image URLs on visibility change
        console.log('🔍 DEBUG - Articles reloaded on visibility change:', savedArticles.length);
        
        setArticles(savedArticles);
        setCategories(categoriesData);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 🔍 DEBUG: useEffect to log first article when articles change
  useEffect(() => {
    if (articles.length > 0) {
      console.log('🔍 First article data:', {
        title: articles[0].title,
        featured_image: articles[0].featured_image,
        has_image: !!articles[0].featured_image,
        image_length: articles[0].featured_image?.length
      });
    }
  }, [articles]);

  const openArticle = (index: number) => {
    setSelectedArticle(index);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const toggleShowAllArticles = () => {
    setShowAllArticles(!showAllArticles);
  };

  const handleNavigateToEditor = () => {
    navigate('/admin');
  };

  // Método público para recargar artículos (útil para llamadas externas)
  const reloadArticles = async () => {
    try {
      const savedArticles = await getPublishedBlogPosts();
      setArticles(savedArticles);
    } catch (error) {
      console.error('Error reloading articles:', error);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Función para obtener el nombre de la categoría - usando función utilitaria
  // const getCategoryName definida en @/utils/categories ya está importada

  // Mostrar loading state
  if (loading) {
    return (
      <section id="blog" className="py-20 bg-gradient-peaceful">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
              Blog Espiritual
            </h2>
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-3 text-muted-foreground">Cargando artículos...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Verificar si el usuario es admin
  const userIsAdmin = isAuthenticated();

  // 🔍 DEBUG: Additional logging
  console.log('🔍 BlogSection Debug:');
  console.log('   Loading:', loading);
  console.log('   Articles count:', articles.length);
  console.log('   User is admin:', userIsAdmin);

  if (articles.length === 0) {
    return (
      <section id="blog" className="py-20 bg-gradient-peaceful">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
              Blog Espiritual
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Reflexiones proféticas, enseñanzas bíblicas y revelaciones espirituales 
              para el crecimiento en el Reino de Dios.
            </p>
            
            {userIsAdmin ? (
              // Vista para Admin - Puede crear artículos
              <div className="mb-8">
                <BookOpen className="w-24 h-24 text-muted-foreground mx-auto mb-4 opacity-50 icon-aqua-gradient" />
                <h3 className="text-2xl font-heading font-bold mb-4 text-primary">
                  Comienza tu ministerio de escritura
                </h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Crea tu primer artículo y comparte la palabra que Dios ha puesto en tu corazón.
                </p>
                <Button 
                  onClick={handleNavigateToEditor}
                  size="lg"
                  className="bg-gradient-aqua hover:shadow-spiritual transition-spiritual"
                >
                  <Plus className="w-5 h-5 mr-2 text-white" />
                  Crear Mi Primer Artículo
                </Button>
              </div>
            ) : (
              // Vista para Visitantes - Mensaje de contenido próximo
              <div className="mb-8">
                <Sparkles className="w-24 h-24 text-muted-foreground mx-auto mb-4 opacity-50 icon-aqua-gradient" />
                <h3 className="text-2xl font-heading font-bold mb-4 text-primary">
                  Contenido espiritual próximamente
                </h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Estamos preparando contenido inspirador y revelaciones proféticas para ti. 
                  ¡Suscríbete al newsletter para ser el primero en recibir nuestras publicaciones!
                </p>
                <div className="bg-gradient-divine p-6 rounded-xl max-w-md mx-auto">
                  <p className="text-sm text-muted-foreground">
                    💫 Próximamente compartiremos enseñanzas sobre el propósito divino, 
                    identidad en Cristo y el llamado profético.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="blog" className="py-20 bg-gradient-peaceful">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
                Blog Espiritual
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Reflexiones proféticas, enseñanzas bíblicas y revelaciones espirituales 
                para tu crecimiento en el Reino de Dios.
              </p>
            </div>

            {/* Featured Article */}
            {articles.length > 0 && (
              <div className="mb-12 animate-slide-up">
                <Card className="overflow-hidden shadow-spiritual hover:shadow-divine transition-spiritual border-primary">
                  <div className="md:flex">
                    <div className="md:w-2/3 p-8 break-words">
                      <Badge className="bg-gradient-spiritual mb-4">Artículo destacado</Badge>
                      <CardTitle className="text-3xl font-heading mb-4 text-primary break-words hyphens-auto">
                        {articles[0].title}
                      </CardTitle>
                      <p className="text-muted-foreground mb-6 text-lg leading-relaxed break-words hyphens-auto">
                        {articles[0].excerpt}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6 flex-wrap">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 icon-aqua-gradient" />
                          <span>{formatDate(articles[0].created_at)}</span>
                        </div>
                        <Badge variant="outline">{getCategoryName(articles[0].category, categories)}</Badge>
                        <span>{articles[0].read_time} de lectura</span>
                      </div>
                      <Button 
                        onClick={() => openArticle(0)}
                        className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual"
                      >
                        Leer artículo completo
                        <ArrowRight className="w-4 h-4 ml-2 icon-aqua-gradient" />
                      </Button>
                    </div>
                    <div className="md:w-1/3 bg-gradient-spiritual flex items-center justify-center p-8 relative overflow-hidden">
                      <img 
                        src={decodeHexUrl(articles[0].featured_image)} 
                        alt="Viaje de transformación espiritual - De la aflicción al propósito"
                        className="w-full h-full object-cover absolute inset-0 opacity-90"
                        onError={(e) => {
                          console.error('🚨 Image failed to load:', articles[0].featured_image);
                          console.error('🚨 Decoded URL:', decodeHexUrl(articles[0].featured_image));
                          console.error('Error event:', e);
                        }}
                        onLoad={() => {
                          console.log('✅ Image loaded successfully:', decodeHexUrl(articles[0].featured_image));
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="relative z-10 text-center text-white">
                        <BookOpen className="w-16 h-16 mx-auto mb-2 opacity-80 icon-aqua-gradient" />
                        <p className="text-sm font-medium">Transformación Espiritual</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* 3D Carousel Articles */}
            {articles.length > 1 && (
              <div className="mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-heading font-bold text-primary mb-2">
                    Más Artículos Espirituales
                  </h3>
                  <p className="text-muted-foreground">
                    Desliza para explorar más enseñanzas y reflexiones
                  </p>
                </div>
                
                <Swiper
                  effect={'coverflow'}
                  grabCursor={true}
                  centeredSlides={true}
                  slidesPerView={'auto'}
                  coverflowEffect={{
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  navigation={true}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                  className="w-full py-12"
                  style={{
                    '--swiper-navigation-color': '#8B5CF6',
                    '--swiper-pagination-color': '#8B5CF6',
                  } as React.CSSProperties}
                >
                  {(showAllArticles ? articles.slice(1) : articles.slice(1, 6)).map((article, index) => (
                    <SwiperSlide
                      key={article.id}
                      className="w-80 h-auto"
                      style={{ width: '320px' }}
                    >
                      <Card 
                        className="shadow-spiritual hover:shadow-divine transition-all duration-300 group cursor-pointer overflow-hidden h-full border-primary/20 hover:border-primary/50 bg-gradient-to-br from-white to-purple-50/30"
                        onClick={() => openArticle(index + 1)}
                      >
                        {/* Featured Image */}
                        {article.featured_image ? (
                          <div className="relative w-full h-56 overflow-hidden">
                            <img 
                              src={decodeHexUrl(article.featured_image)} 
                              alt={`Imagen del artículo: ${article.title}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                console.error('🚨 Carousel image failed to load:', article.featured_image);
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            
                            {/* Category badge */}
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-gradient-spiritual text-white border-0 shadow-lg">
                                {getCategoryName(article.category, categories)}
                              </Badge>
                            </div>
                            
                            {/* Reading time */}
                            <div className="absolute top-4 right-4">
                              <Badge variant="secondary" className="bg-white/90 text-gray-800 border-0 shadow-lg">
                                <Clock className="w-3 h-3 mr-1" />
                                {article.read_time}
                              </Badge>
                            </div>
                            
                            {/* Title overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h4 className="text-white font-heading font-bold text-lg leading-tight line-clamp-2">
                                {article.title}
                              </h4>
                            </div>
                          </div>
                        ) : (
                          // Fallback for articles without images
                          <div className="relative w-full h-56 bg-gradient-spiritual flex items-center justify-center">
                            <BookOpen className="w-16 h-16 text-white/80" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h4 className="text-white font-heading font-bold text-lg leading-tight line-clamp-2">
                                {article.title}
                              </h4>
                            </div>
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/20 text-white border-white/30">
                                {getCategoryName(article.category, categories)}
                              </Badge>
                            </div>
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-white/20 text-white border-white/30">
                                <Clock className="w-3 h-3 mr-1" />
                                {article.read_time}
                              </Badge>
                            </div>
                          </div>
                        )}
                        
                        <CardContent className="p-6">
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                            {article.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Calendar className="w-3 h-3 icon-aqua-gradient" />
                              <span>{formatDate(article.created_at)}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="group-hover:text-primary transition-spiritual text-primary/70 hover:text-primary"
                            >
                              Leer más
                              <ArrowRight className="w-3 h-3 ml-1 icon-aqua-gradient" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            {/* Show "View All" button only if there are more than 5 articles */}
            {articles.length > 5 && !showAllArticles && (
              <div className="text-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={toggleShowAllArticles}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-spiritual"
                >
                  {showAllArticles ? 'Ver menos artículos' : 'Ver todos los artículos'}
                  <BookOpen className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Full Page View */}
      {selectedArticle !== null && articles[selectedArticle] && (
        <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
          {/* Header */}
          <header className="sticky top-0 bg-background/95 backdrop-blur-sm border-b border-border z-10">
            <div className="container mx-auto px-4 lg:px-6">
              <div className="flex items-center justify-between h-16">
                <Button 
                  variant="ghost" 
                  onClick={closeArticle}
                  className="flex items-center space-x-2 hover:bg-primary/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver al blog</span>
                </Button>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <main className="container mx-auto px-4 lg:px-6 py-8 max-w-full">
            <article className="max-w-4xl mx-auto overflow-hidden">
              {/* Article Header */}
              <header className="mb-8 break-words">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4 flex-wrap">
                  <Badge className="bg-gradient-spiritual">
                    {getCategoryName(articles[selectedArticle].category, categories)}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(articles[selectedArticle].created_at)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{articles[selectedArticle].read_time} de lectura</span>
                  </div>
                  {articles[selectedArticle].author && (
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{articles[selectedArticle].author}</span>
                    </div>
                  )}
                </div>
                
                <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-6 leading-tight break-words">
                  {articles[selectedArticle].title}
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed break-words">
                  {articles[selectedArticle].excerpt}
                </p>
              </header>

              {/* Featured Image */}
              {articles[selectedArticle].featured_image && (
                <div className="mb-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-spiritual">
                    <img 
                      src={decodeHexUrl(articles[selectedArticle].featured_image)} 
                      alt={`Imagen del artículo: ${articles[selectedArticle].title}`}
                      className="w-full h-auto object-contain max-h-96"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              )}

              {/* Article Body */}
              <div className="prose prose-lg max-w-none prose-headings:text-primary prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:p-6 prose-blockquote:rounded-r-lg prose-strong:text-primary prose-li:marker:text-primary break-words overflow-hidden">
                {articles[selectedArticle].content ? (
                  <div 
                    dangerouslySetInnerHTML={{ __html: articles[selectedArticle].content }}
                    className="break-words overflow-wrap-anywhere"
                  />
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Contenido completo disponible próximamente
                    </p>
                  </div>
                )}
              </div>

              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={closeArticle}
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver al blog</span>
                  </Button>
                </div>
              </footer>
            </article>
          </main>
        </div>
      )}
    </>
  );
}