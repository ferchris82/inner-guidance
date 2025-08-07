import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight, BookOpen } from "lucide-react";

export function BlogSection() {
  const articles = [
    {
      title: "¿Qué sucede cuando renuncias a la cruz, creyendo que es aflicción?",
      excerpt: "Hay momentos en que Dios revela el llamado, despierta el propósito, y marca asignaciones concretas sobre una persona. La carga es clara. El anhelo por obedecer es verdadero...",
      date: "5 de Agosto, 2025",
      category: "Llamado divino",
      readTime: "8 min",
      featured: true
    },
    {
      title: "Tu provisión en tiempo de aflicción",
      excerpt: "¡Pueblo de Dios, oigan lo que el Espíritu está diciendo en este tiempo! No estamos ante una crisis cualquiera. Estamos en un Kairos del cielo...",
      date: "2 de Agosto, 2025",
      category: "Mensaje profético",
      readTime: "12 min",
      featured: false
    },
    {
      title: "Dios no necesita que intervengas en el cumplimiento de su propósito",
      excerpt: "No le ayudes a Dios. La prisa desvía el diseño. Hay una operación espiritual activa que busca sabotear los propósitos divinos...",
      date: "1 de Agosto, 2025",
      category: "Propósito divino",
      readTime: "10 min",
      featured: false
    },
    {
      title: "Identidad espiritual vs identidad humana",
      excerpt: "Entender la diferencia entre quiénes somos en el espíritu y nuestra identidad terrenal es fundamental para caminar en nuestro propósito...",
      date: "28 de Julio, 2025",
      category: "Identidad",
      readTime: "15 min",
      featured: false
    },
    {
      title: "Planificación profética para el Reino",
      excerpt: "Cómo alinear nuestros planes con los propósitos eternos de Dios y caminar en sincronía con los tiempos divinos...",
      date: "25 de Julio, 2025",
      category: "Profecía",
      readTime: "11 min",
      featured: false
    },
    {
      title: "Los dos testigos del fin de los tiempos",
      excerpt: "Una revelación profética sobre el ministerio de los dos testigos y su relevancia para la iglesia de hoy...",
      date: "22 de Julio, 2025",
      category: "Profecía escatológica",
      readTime: "18 min",
      featured: false
    }
  ];

  return (
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
          <div className="mb-12 animate-slide-up">
            <Card className="overflow-hidden shadow-spiritual hover:shadow-divine transition-spiritual border-primary">
              <div className="md:flex">
                <div className="md:w-2/3 p-8">
                  <Badge className="bg-gradient-spiritual mb-4">Artículo destacado</Badge>
                  <CardTitle className="text-3xl font-heading mb-4 text-primary">
                    {articles[0].title}
                  </CardTitle>
                  <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                    {articles[0].excerpt}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{articles[0].date}</span>
                    </div>
                    <Badge variant="outline">{articles[0].category}</Badge>
                    <span>{articles[0].readTime} de lectura</span>
                  </div>
                  <Button className="bg-gradient-spiritual hover:shadow-spiritual transition-spiritual">
                    Leer artículo completo
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="md:w-1/3 bg-gradient-spiritual flex items-center justify-center p-8">
                  <BookOpen className="w-24 h-24 text-white opacity-50" />
                </div>
              </div>
            </Card>
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {articles.slice(1).map((article, index) => (
              <Card 
                key={index} 
                className="shadow-peaceful hover:shadow-spiritual transition-spiritual animate-slide-up group cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {article.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-heading group-hover:text-primary transition-spiritual">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="group-hover:text-primary transition-spiritual">
                      Leer más
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

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
  );
}