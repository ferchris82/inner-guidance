import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Lightbulb, Users, Book, Star, Target, Shield, Sparkles, Play } from "lucide-react";
import mentorPortrait from "@/assets/mentor-portrait.png";

export function AboutSection() {
  return (
    <section id="acerca" className="py-20 bg-gradient-peaceful">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-gradient-spiritual">
              Acerca de mí
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              María Teresa Gutiérrez Villa, conocida como <strong className="text-primary">Maité</strong>
            </p>
            <div className="mt-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-lg font-semibold text-gradient-spiritual">
                "Mi propósito es... guiarte a encontrar el tuyo"
              </p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
            {/* Portrait Section */}
            <div className="animate-slide-up">
              <div className="relative">
                <img 
                  src={mentorPortrait} 
                  alt="Maité Gutiérrez - Monitora Espiritual"
                  className="rounded-2xl shadow-spiritual w-full max-w-md mx-auto"
                />
              </div>
            </div>

            {/* Story Section */}
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-3xl font-heading font-bold mb-6 text-primary">
                Mi Historia Espiritual
              </h3>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Desde que tengo memoria, <strong className="text-primary">la búsqueda de la identidad espiritual ha sido el hilo conductor de mi vida.</strong> Crecí en un entorno religioso cristiano que despertó mi fascinación por lo divino, pero fue al salir del colegio cuando comencé realmente mi camino de búsqueda personal para conectarme con la Fuente, más allá de los sistemas y estructuras.
                </p>
                <p>
                  Durante años exploré diversas corrientes espirituales, tratando de llenar vacíos que ninguna parecía poder llenar por completo. El punto de quiebre llegó a través de un proceso inesperado: <strong className="text-primary">cuando llevé a mi hijo mayor a terapia por problemas de conducta, descubrí que era yo quien necesitaba un proceso profundo de transformación.</strong>
                </p>
                <p>
                  Lo que comenzó como un par de sesiones para él, se convirtió en un año y medio de sanidad para mí. Fue allí donde <strong className="text-primary">rompí con estructuras religiosas limitantes y empecé el verdadero descubrimiento de quién soy.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Journey Section */}
          <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-heading font-bold mb-6 text-primary text-center">
                Mi Camino de Transformación
              </h3>
              <div className="space-y-4 text-lg text-muted-foreground">
                <p>
                  Más tarde, acompañando a una prima en búsqueda de su propósito de vida, terminé involucrándome en una comunidad evangélica protestante, donde nuevamente fui guiada por el Espíritu de Dios. Ese recorrido me llevó a <strong className="text-primary">diferentes ministerios, donde recibí activación en mis dones y llamados, hasta asumir con responsabilidad la misión para la que fui creada.</strong>
                </p>
                <p>
                  Hoy mi propósito es claro: <strong className="text-primary">quiero hacerme visible y accesible a todas aquellas personas que Dios desee conectar con el mensaje que Él quiera entregar a través de mí.</strong> Mi anhelo es que quienes lleguen a este espacio sientan que no fue casualidad, sino que <strong className="text-primary">encontraron exactamente las respuestas que sus almas buscaban.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-heading font-bold mb-4 text-primary">
                Conoce mi mensaje
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Te invito a escuchar directamente mi corazón y el mensaje que Dios ha puesto en mí para ti.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-spiritual">
                <iframe
                  src="https://www.youtube.com/embed/YiXhp71-QPA"
                  title="Maité Gutiérrez - Monitora Espiritual"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="text-center mt-4">
                <p className="text-muted-foreground text-sm">
                  <Play className="w-4 h-4 inline mr-1" />
                  Haz clic para reproducir y conocer más sobre mi misión espiritual
                </p>
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="mb-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-heading font-bold mb-4 text-primary">
                Mi Misión y Enfoque
              </h3>
              <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
                En este espacio comparto reflexiones, meditaciones, verdades ocultas de la Biblia, aclaraciones sobre errores doctrinales, historias personales, principios espirituales, consejos y técnicas para <strong className="text-primary">vivir en plenitud y alineamiento con el diseño divino.</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
                <CardContent className="p-6">
                  <div className="bg-gradient-spiritual p-3 rounded-full w-fit mb-4">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-heading font-semibold mb-3 text-primary">
                    Mi Identidad Espiritual
                  </h4>
                  <p className="text-muted-foreground">
                    No me considero religiosa, sino un <strong className="text-primary">Ser espiritual guiado</strong> por los principios de Jesús de Nazareth, por la Palabra de Dios en las Santas Escrituras, y por las revelaciones que Espíritu Santo me entrega en intimidad con el Padre.
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-peaceful hover:shadow-spiritual transition-spiritual">
                <CardContent className="p-6">
                  <div className="bg-gradient-spiritual p-3 rounded-full w-fit mb-4">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-heading font-semibold mb-3 text-primary">
                    Mi Diferencia
                  </h4>
                  <p className="text-muted-foreground">
                    No estoy atada a organizaciones humanas ni a filosofías que determinen qué es aceptado o correcto. <strong className="text-primary">Mi guía es el Espíritu de Dios,</strong> y mi misión es ayudarte a reconocer tu verdadera identidad como hijo(a) del Reino de los Cielos.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Services Preview */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="text-center mb-8">
              <h3 className="text-3xl font-heading font-bold mb-4 text-primary">
                Cómo Te Puedo Ayudar
              </h3>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Mi mayor deseo es que al recorrer estas páginas <strong className="text-primary">te sientas gozoso(a) por haber descubierto quién eres realmente y motivado(a) a cumplir el propósito para el cual fuiste creado(a), alcanzando así una profunda plenitud del alma.</strong>
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Heart,
                  title: "Crecimiento Personal",
                  description: "Acompañamiento en el desarrollo de tu identidad espiritual y emocional."
                },
                {
                  icon: Target,
                  title: "Propósito de Vida",
                  description: "Descubrimiento y activación de tu llamado divino único."
                },
                {
                  icon: Users,
                  title: "Guía Profética",
                  description: "Dirección espiritual basada en la revelación del Espíritu Santo."
                },
                {
                  icon: Book,
                  title: "Enseñanza Bíblica",
                  description: "Fundamentos sólidos en la Palabra para tu crecimiento espiritual."
                }
              ].map((item, index) => (
                <Card 
                  key={index} 
                  className="shadow-peaceful hover:shadow-spiritual transition-spiritual"
                >
                  <CardContent className="p-6 text-center">
                    <div className="bg-gradient-spiritual p-3 rounded-full w-fit mx-auto mb-4">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="text-lg font-heading font-semibold mb-2 text-primary">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center animate-slide-up" style={{ animationDelay: '1s' }}>
            <div className="bg-gradient-spiritual p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-heading font-bold mb-4">
                Gracias por estar aquí
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Bienvenido(a) a este espacio creado para ti. Siempre me ha apasionado el mejoramiento de los procesos, tanto personales como profesionales, lo que me llevó a formarme como formuladora y gestora de proyectos. Hoy pongo todo ese conocimiento y experiencia al servicio del ser humano, <strong>apoyando la transformación de los procesos existenciales que tienen su raíz en los principios espirituales.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}