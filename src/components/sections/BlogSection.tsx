import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, BookOpen, X, Share2, ArrowLeft, Clock, User } from "lucide-react";
import { getBlogPosts, BlogPost } from "@/utils/blogStorage";

export function BlogSection() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [articles, setArticles] = useState<BlogPost[]>([]);

  // Cargar artículos al montar el componente
  useEffect(() => {
    const loadArticles = () => {
      const savedArticles = getBlogPosts();
      if (savedArticles.length > 0) {
        setArticles(savedArticles);
      } else {
        // Artículos por defecto si no hay ninguno guardado
        const defaultArticles: BlogPost[] = [
          {
            id: "1",
            title: "¿Qué sucede cuando renuncias a la cruz, creyendo que es aflicción?",
            excerpt: "Hay momentos en que Dios revela el llamado, despierta el propósito, y marca asignaciones concretas sobre una persona. La carga es clara. El anhelo por obedecer es verdadero...",
            content: `
              <article class="prose prose-lg max-w-none">
                <h1>✨ Aceptación del llamado</h1>
                <p>Hay momentos en que Dios revela el llamado, despierta el propósito, y marca asignaciones concretas sobre una persona. La carga es clara. El anhelo por obedecer es verdadero. La oración suena sincera:</p>
                <blockquote>"Señor, haz conmigo como quieras. Te entrego mi vida. Envíame."</blockquote>
                <p>Y Dios toma esas palabras en serio. Pero el Reino no avanza con promesas humanas, sino con obediencia probada.</p>
                <blockquote>"El crisol es para la plata, y la hornaza para el oro, pero Jehová prueba los corazones." (Proverbios 17:3)</blockquote>
                <p>La prueba no es castigo. Es selección.</p>
                <p>Cuando el cielo te llama, la tierra te sacude. Cuando el propósito es revelado, la fidelidad es probada. Porque antes de confiar una herencia, Dios examina si puedes soportar peso, presión, oposición.</p>
                <p>Y ahí es donde muchos fallan. No porque no amen a Dios, sino porque no entienden cómo funciona el mundo espiritual.</p>
                <h2>💡 El día de aflicción revela dónde está tu fuerza</h2>
                <p>Dios no tienta, pero sí permite el crisol. Permite:</p>
                <ul>
                  <li>Incomodidad</li>
                  <li>Despojo</li>
                  <li>Incomprensión</li>
                </ul>
                <p>No para aplastarte… sino para exponer si tu fuerza viene del Espíritu o de tus recursos.</p>
                <blockquote>"Si fueres flojo en el día de la angustia, tu fuerza será reducida." (Proverbios 24:10)</blockquote>
                <p>En hebreo, "flojo" es <strong>rafáh</strong>, que implica:</p>
                <ul>
                  <li>Flaquear</li>
                  <li>Ceder</li>
                  <li>Soltar</li>
                  <li>Aflojar el alma</li>
                </ul>
                <p>Es no sostener la fe cuando duele. Es clamar por alivio, antes que por transformación.</p>
                <h2>🙏 A veces Dios permite… lo que pediste fuera de su diseño</h2>
                <p>Cuando en medio de la prueba clamas:</p>
                <blockquote>"Señor, sácame de esto…"</blockquote>
                <p>Dios puede responder concediendo la petición. No porque sea su voluntad perfecta, sino porque no obliga a nadie a seguir a Cristo.</p>
                <blockquote>"Si alguno quiere venir en pos de mí, niéguese a sí mismo, tome su cruz y sígame." (Lucas 9:23)</blockquote>
                <p>El que no está dispuesto, no será forzado.<br>
                Pero tampoco será hallado digno de lo que fue reservado al final de la prueba.</p>
                <h2>😔 El alma humana se acomoda… y se desvía</h2>
                <p>Una vez pasa la aflicción y se consigue "estabilidad", muchos se sienten "bendecidos". Pero la pregunta no es si tienes trabajo o metas… sino:</p>
                <p><strong>¿Estás en lo que se te asignó?</strong></p>
                <p>Muchos cambian:</p>
                <ul>
                  <li>Fuego por rutina</li>
                  <li>Altar por agenda</li>
                  <li>Obediencia por productividad</li>
                </ul>
                <p>Sin notarlo, se convierten en <strong>autómatas espirituales</strong>. Siguen activos, pero han perdido el rumbo.</p>
                <h2>🧠 Cuando la fuerza humana se vuelve en tu contra</h2>
                <p>Dios había preparado un galardón. Un avance real. Una estabilidad por diseño.</p>
                <p>Pero al declinar la prueba, el alma se aferra a lo que puede conseguir por sí misma. Y eso que parecía fortaleza… se convierte en carga.</p>
                <blockquote>"Porque dijisteis: Haremos huida en caballos veloces, por tanto, vosotros huiréis; sobre corceles ligeros cabalgaremos, por eso serán veloces vuestros perseguidores." (Isaías 30:16)</blockquote>
                <p>La fuente en la que confiaste, el plan que ideaste, el trabajo que sostenías… se vuelve contra ti.</p>
              </article>
            `,
            template: "spiritual",
            category: "llamado-divino",
            author: "Maité Gutiérrez",
            featuredImage: "/images/transformation-journey.jpg",
            readTime: "8 min",
            featured: true,
            createdAt: "2025-08-05T00:00:00.000Z",
            updatedAt: "2025-08-05T00:00:00.000Z",
            customStyles: {
              primaryColor: "#2c3e50",
              secondaryColor: "#7f8c8d",
              fontFamily: "Georgia, serif",
              spacing: "relaxed"
            }
          },
          {
            id: "2",
            title: "Mensaje profético: Tu provisión en tiempo de aflicción",
            excerpt: "Una revelación profética sobre el ministerio de los dos testigos y su relevancia para la iglesia de hoy...",
            content: `
              <article class="prose prose-lg max-w-none">
                <h1>🌟 Mensaje Profético: Tu Provisión en Tiempo de Aflicción</h1>
                <p>En este tiempo de aflicción, Dios tiene una provisión especial para ti. Este mensaje profético te revelará cómo acceder a la provisión divina en medio de las pruebas.</p>
                <h2>💎 La Provisión Divina</h2>
                <p>Dios nunca te deja sin recursos. En cada aflicción, hay una provisión preparada de antemano.</p>
                <blockquote>"Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús." (Filipenses 4:19)</blockquote>
                <h3>🎯 Tres Niveles de Provisión</h3>
                <ol>
                  <li><strong>Provisión Física:</strong> Necesidades materiales</li>
                  <li><strong>Provisión Espiritual:</strong> Fortaleza y sabiduría</li>
                  <li><strong>Provisión Emocional:</strong> Paz y consuelo</li>
                </ol>
              </article>
            `,
            template: "modern",
            category: "mensaje-profetico",
            author: "Maité Gutiérrez",
            featuredImage: "/images/provision-afliccion.jpg",
            readTime: "5 min",
            featured: false,
            createdAt: "2025-08-02T00:00:00.000Z",
            updatedAt: "2025-08-02T00:00:00.000Z",
            customStyles: {
              primaryColor: "#1a1a1a",
              secondaryColor: "#666",
              fontFamily: "Inter, sans-serif",
              spacing: "compact"
            }
          }
        ];
        setArticles(defaultArticles);
      }
    };
    
    loadArticles();
  }, []);

  const openArticle = (index: number) => {
    setSelectedArticle(index);
  };

  const closeArticle = () => {
    setSelectedArticle(null);
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
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gradient-spiritual">
              Blog Espiritual
            </h2>
            <p className="text-xl text-muted-foreground">
              Cargando artículos...
            </p>
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
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gradient-spiritual">
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
                {articles.slice(1).map((article, index) => (
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

            <div className="text-center">
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-spiritual"
              >
                Ver todos los artículos
                <BookOpen className="w-5 h-5 ml-2" />
              </Button>
            </div>
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