import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, BookOpen, X, Share2, ArrowLeft, Clock, User, Plus } from "lucide-react";
import { getBlogPosts, BlogPost } from "@/utils/blogStorage";

export function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [articles, setArticles] = useState<BlogPost[]>([]);
  const [showAllArticles, setShowAllArticles] = useState(false);
  const navigate = useNavigate();

  // Cargar artículos al montar el componente
  useEffect(() => {
    const loadArticles = () => {
      const savedArticles = getBlogPosts();
      setArticles(savedArticles);
    };
    
    loadArticles();
    
    // Escuchar cambios en localStorage (opcional)
    const handleStorageChange = () => {
      loadArticles();
    };
    
    // Escuchar cuando se vuelve visible la página
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadArticles();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

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
  const reloadArticles = () => {
    const savedArticles = getBlogPosts();
    setArticles(savedArticles);
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

  // Función para obtener el nombre de la categoría
  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      'llamado-divino': 'Llamado Divino',
      'mensaje-profetico': 'Mensaje Profético',
      'proposito-divino': 'Propósito Divino',
      'identidad': 'Identidad',
      'profecia': 'Profecía'
    };
    return categories[category] || category;
  };

  if (articles.length === 0) {
    return (
      <section id="blog" className="py-20 bg-gradient-peaceful">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-primary">
              Blog Espiritual
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              ¡Bienvenido a tu espacio espiritual! Aquí compartirás reflexiones proféticas, 
              enseñanzas bíblicas y revelaciones para el crecimiento en el Reino de Dios.
            </p>
            <div className="mb-8">
              <BookOpen className="w-24 h-24 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-2xl font-heading font-bold mb-4 text-primary">
                Comienza tu ministerio de escritura
              </h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Crea tu primer artículo y comparte la palabra que Dios ha puesto en tu corazón.
              </p>
              <Button 
                onClick={handleNavigateToEditor}
                size="lg"
                className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual"
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Mi Primer Artículo
              </Button>
            </div>
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
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(articles[0].createdAt)}</span>
                        </div>
                        <Badge variant="outline">{getCategoryName(articles[0].category)}</Badge>
                        <span>{articles[0].readTime} de lectura</span>
                      </div>
                      <Button 
                        onClick={() => openArticle(0)}
                        className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual"
                      >
                        Leer artículo completo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                    <div className="md:w-1/3 bg-gradient-spiritual flex items-center justify-center p-8 relative overflow-hidden">
                      <img 
                        src={articles[0].featuredImage} 
                        alt="Viaje de transformación espiritual - De la aflicción al propósito"
                        className="w-full h-full object-cover absolute inset-0 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="relative z-10 text-center text-white">
                        <BookOpen className="w-16 h-16 mx-auto mb-2 opacity-80" />
                        <p className="text-sm font-medium">Transformación Espiritual</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Articles Grid */}
            {articles.length > 1 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {(showAllArticles ? articles.slice(1) : articles.slice(1, 4)).map((article, index) => (
                  <Card 
                    key={article.id} 
                    className="shadow-peaceful hover:shadow-spiritual transition-spiritual animate-slide-up group cursor-pointer overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="break-words">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryName(article.category)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-heading group-hover:text-primary transition-spiritual break-words hyphens-auto">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="break-words">
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed break-words hyphens-auto">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(article.createdAt)}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="group-hover:text-primary transition-spiritual"
                          onClick={() => openArticle(index + 1)}
                        >
                          Leer más
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Show "View All" button only if there are more than 4 articles */}
            {articles.length > 4 && (
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
                    {getCategoryName(articles[selectedArticle].category)}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(articles[selectedArticle].createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{articles[selectedArticle].readTime} de lectura</span>
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
              {articles[selectedArticle].featuredImage && (
                <div className="mb-8">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-spiritual">
                    <img 
                      src={articles[selectedArticle].featuredImage} 
                      alt={`Imagen del artículo: ${articles[selectedArticle].title}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
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